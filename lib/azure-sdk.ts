import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import * as msal from "@azure/msal-node";
import fs from "fs";
import path from "path";

interface GraphUser {
  displayName: string;
  jobTitle: string | null;
  department: string | null;
  mail: string | null;
  id: string;
}

interface PolicyConditions {
  users: { includeUsers: string[] };
  applications: { includeApplications: string[] };
}

interface SendEmailOptions {
  toRecipients: string | string[];
  subject: string;
  htmlContent?: string;
  accessoryData?: Record<string, unknown>[] | unknown[][];
  attachmentPaths?: string | string[];
  cc?: string | string[];
  columnsOrder?: string[];
}

const ATTACHMENT_CONTENT_TYPES: Record<string, string> = {
  ".py": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "text/xml; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".yml": "text/plain; charset=utf-8",
  ".yaml": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".zip": "application/zip",
};

const TEXT_EXTENSIONS = new Set([
  ".py", ".txt", ".csv", ".html", ".json", ".xml", ".md", ".yml", ".yaml",
]);

export class AzureSdk {
  private static LOGIN_URI = "https://login.microsoftonline.com";
  private static GRAPH_V1 = "https://graph.microsoft.com/v1.0";

  private tenantId: string;
  private clientId: string;
  private appSecret?: string;
  private mailbox?: string;
  private accessToken?: string;
  private headers?: Record<string, string>;

  constructor(
    tenantId: string,
    clientId: string,
    appSecret?: string,
    mailbox?: string,
  ) {
    this.tenantId = tenantId;
    this.clientId = clientId;
    this.appSecret = appSecret;
    this.mailbox = mailbox;
  }

  /**
   * 验证 Azure AD 登录产生的 id_token
   */
  async loginTokenVerify(
    idToken: string,
  ): Promise<[true, jwt.JwtPayload] | [false, string]> {
    const authority = `${AzureSdk.LOGIN_URI}/${this.tenantId}`;
    const discoveryUrl = `${authority}/v2.0/.well-known/openid-configuration`;

    const res = await fetch(discoveryUrl);
    const openidConfig = await res.json();
    const jwksUri: string = openidConfig.jwks_uri;
    const issuer: string = openidConfig.issuer;

    const client = jwksClient({ jwksUri });

    const decodedHeader = jwt.decode(idToken, { complete: true });
    if (!decodedHeader || !decodedHeader.header.kid) {
      return [false, "无效的AAD凭证"];
    }

    try {
      const key = await client.getSigningKey(decodedHeader.header.kid);
      const publicKey = key.getPublicKey();

      const decoded = jwt.verify(idToken, publicKey, {
        algorithms: ["RS256"],
        audience: this.clientId,
        issuer,
      }) as jwt.JwtPayload;

      return [true, decoded];
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return [false, "AAD登录凭证已过期"];
      }
      return [false, "无效的AAD凭证"];
    }
  }

  /**
   * 获取用户列表（自动分页），过滤掉非 flyingnets.com 邮箱和会议室
   */
  async getUsersList(): Promise<GraphUser[]> {
    const url =
      `${AzureSdk.GRAPH_V1}/users?$select=displayName,jobTitle,department,mail,id`;
    const allUsers = await this.autoGetPageData<GraphUser>(url);

    return allUsers.filter((user) => {
      if (user.mail && !user.mail.includes("flyingnets.com")) return false;
      if (
        user.displayName.includes("会议室") ||
        user.displayName.includes("洽谈室")
      )
        return false;
      return true;
    });
  }

  /**
   * 自动获取 Graph API 分页数据
   */
  private async autoGetPageData<T>(initialUrl: string): Promise<T[]> {
    const results: T[] = [];
    let nextLink: string | undefined = initialUrl;

    while (nextLink) {
      const res = await fetch(nextLink, { headers: this.headers });
      const data = await res.json();

      if (!res.ok) {
        console.error(`Error: ${data?.error?.message}`);
        break;
      }

      const values: T[] = data.value ?? [];
      results.push(...values);
      nextLink = data["@odata.nextLink"];
    }

    return results;
  }

  /**
   * 使用 MSAL 的客户端凭据流获取 Graph API 的 access_token
   */
  async appAuth(
    mailbox: string,
    appClientId: string,
    appSecret: string,
    appTenantId: string,
  ): Promise<void> {
    const authority = `${AzureSdk.LOGIN_URI}/${appTenantId}`;
    const scopes = ["https://graph.microsoft.com/.default"];

    const app = new msal.ConfidentialClientApplication({
      auth: {
        clientId: appClientId,
        authority,
        clientSecret: appSecret,
      },
    });

    const tokenResponse = await app.acquireTokenByClientCredential({ scopes });
    if (!tokenResponse?.accessToken) {
      throw new Error("Failed to acquire access token");
    }

    this.accessToken = tokenResponse.accessToken;
    this.headers = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
    this.mailbox = mailbox;
  }

  /**
   * 创建条件访问策略，限制用户登录 Outlook（Exchange Online）
   */
  async createConditionalAccessPolicy(
    userAzureId: string,
    email: string,
  ): Promise<[boolean, unknown]> {
    const GRAPH_API_URL =
      `${AzureSdk.GRAPH_V1}/identity/conditionalAccess/policies`;
    const EXCHANGE_ONLINE_APP_ID = "00000002-0000-0ff1-ce00-000000000000";

    const policyData = {
      displayName: `Block Outlook Access for ${email}`,
      state: "enabled",
      conditions: {
        users: { includeUsers: [userAzureId] },
        applications: { includeApplications: [EXCHANGE_ONLINE_APP_ID] },
      } as PolicyConditions,
      grantControls: {
        operator: "OR",
        builtInControls: ["block"],
      },
    };

    await this.revokeUserSession(email);

    const res = await fetch(GRAPH_API_URL, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(policyData),
    });

    const body = await res.json();
    if (res.status === 201) {
      console.log("条件访问策略已成功创建！");
      return [true, body];
    }
    console.error(`失败: ${res.status}`, body);
    return [false, body];
  }

  /**
   * 删除条件访问策略
   */
  async deleteConditionalAccessPolicy(
    policyId: string,
  ): Promise<[boolean, string]> {
    const url =
      `${AzureSdk.GRAPH_V1}/identity/conditionalAccess/policies/${policyId}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: this.headers,
    });

    if (res.status === 204) {
      console.log("条件访问策略已成功删除！");
      return [true, ""];
    }
    const text = await res.text();
    console.error(`失败: ${res.status}`, text);
    return [false, text];
  }

  /**
   * 强制注销用户会话
   */
  async revokeUserSession(userId: string): Promise<[boolean, string]> {
    const url =
      `${AzureSdk.GRAPH_V1}/users/${userId}/revokeSignInSessions`;

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (res.ok) {
      console.log("User session revoked successfully.");
      return [true, ""];
    }
    const text = await res.text();
    return [false, text];
  }

  /**
   * 查询已有的条件访问策略
   */
  async getConditionalAccessPolicy(): Promise<unknown> {
    const url =
      `${AzureSdk.GRAPH_V1}/identity/conditionalAccess/policies`;
    const res = await fetch(url, { headers: this.headers });
    const data = await res.json();
    console.log(data);
    return data;
  }

  /**
   * 通过 Microsoft Graph 发送邮件，支持多收件人、多抄送及附件
   */
  async sendEmail(options: SendEmailOptions): Promise<string> {
    const {
      toRecipients,
      subject,
      htmlContent = "",
      accessoryData,
      attachmentPaths,
      cc,
      columnsOrder,
    } = options;

    const toList = toArray(toRecipients);
    const ccList = toArray(cc);

    if (toList.length === 0) return "发送失败: 收件人不能为空";

    const message: Record<string, unknown> = {
      subject,
      body: { contentType: "Html", content: htmlContent },
      toRecipients: toList.map((addr) => ({
        emailAddress: { address: addr },
      })),
    };

    if (ccList.length > 0) {
      message.ccRecipients = ccList.map((addr) => ({
        emailAddress: { address: addr },
      }));
    }

    const attachments: Record<string, unknown>[] = [];

    if (accessoryData && accessoryData.length > 0) {
      const csvContent = this.buildCsv(accessoryData, columnsOrder);
      attachments.push({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: "attachment.csv",
        contentType: "text/csv",
        contentBytes: Buffer.from(csvContent, "utf-8").toString("base64"),
      });
    }

    const paths = toArray(attachmentPaths);
    for (const filePath of paths) {
      if (!filePath || !fs.existsSync(filePath)) continue;

      const ext = path.extname(filePath).toLowerCase();
      const contentType =
        ATTACHMENT_CONTENT_TYPES[ext] ?? "application/octet-stream";

      let raw = fs.readFileSync(filePath);
      if (TEXT_EXTENSIONS.has(ext)) {
        raw = Buffer.from(raw.toString("utf-8"));
      }

      attachments.push({
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: path.basename(filePath),
        contentType,
        contentBytes: raw.toString("base64"),
      });
    }

    if (attachments.length > 0) {
      message.attachments = attachments;
    }

    const url =
      `${AzureSdk.GRAPH_V1}/users/${this.mailbox}/sendMail`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ message }),
    });

    if (res.status === 200 || res.status === 202) return "发送成功";
    const text = await res.text();
    return `发送失败: ${res.status} ${text}`;
  }

  /**
   * 将数据转换为 CSV 字符串（带 BOM，逗号分隔）
   */
  private buildCsv(
    data: Record<string, unknown>[] | unknown[][],
    columnsOrder?: string[],
  ): string {
    const BOM = "\uFEFF";

    if (Array.isArray(data[0]) && !columnsOrder) {
      // 二维数组
      return (
        BOM +
        (data as unknown[][])
          .map((row) =>
            row
              .map((cell) => {
                const s = String(cell ?? "").replace(/"/g, "'");
                return `"${s}"`;
              })
              .join(","),
          )
          .join("\n")
      );
    }

    // 字典列表
    const rows = data as Record<string, unknown>[];
    const columns =
      columnsOrder ?? Object.keys(rows[0] ?? {});

    const header = columns.map((c) => `"${c}"`).join(",");
    const body = rows
      .map((row) =>
        columns
          .map((col) => {
            const val = String(row[col] ?? "").replace(/"/g, "'");
            return `"${val}"`;
          })
          .join(","),
      )
      .join("\n");

    return `${BOM}${header}\n${body}`;
  }
}

function toArray(val: string | string[] | undefined | null): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}
