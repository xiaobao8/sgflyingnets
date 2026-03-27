# Acunetix 安全扫描综合报告

**目标网站**: www.sgflyingnets.com
**扫描URL**: www.sgflyingnets.com
**扫描类型**: Full Scan
**开始时间**: 2026-03-26T18:00:28.803174+08:00
**结束时间**: 2026-03-26T22:47:25.469794+08:00
**扫描耗时**: 4:46:04
**请求数量**: 221280
**平均响应时间**: 38ms
**最大响应时间**: 31059ms
**发现位置数**: 307
**操作系统**: Unix
**服务器**: nginx/1.24.0 (Ubuntu)
**构建版本**: 25.8.250820089
**发现的主机**:
  - https://note.com
  - https://images.unsplash.com
  - https://sgflyingnets.com

---

## 漏洞摘要

| 严重等级 | 漏洞类型数 | 实例数 |
|---------|-----------|-------|
| Critical | 2 | 2 |
| High | 5 | 5 |
| Medium | 4 | 5 |
| Low | 4 | 4 |
| Informational | 7 | 7 |
| **总计** | **22** | **23** |

---

## 漏洞详情

### Command Injection

- **严重等级**: Critical (Level 4)
- **实例数量**: 1
- **CVSS 评分**: 9.1
- **CVSS 4.0 评分**: 9.3
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N/SC:N/SI:N/SA:N`
- **标签**: code_execution, CWE-94

**影响**:
A malicious user may execute arbitrary system commands with the permissions of the web server.

**描述**:
This script is vulnerable to code execution attacks.Code injection vulnerabilities occur where the output or content served from a Web application can be manipulated in such a way that it triggers server-side code execution. In some poorly written Web applications that allow users to modify server-side files (such as by posting to a message board or guestbook) it is sometimes possible to inject code in the scripting language of the application itself.

**修复建议**:
Your script should filter metacharacters from user input.

**参考链接**:
- [Security Focus - Penetration Testing for Web Applications (Part Two)](https://www.symantec.com/connect/articles/penetration-testing-web-applications-part-two)
- [OWASP PHP Top 5](https://www.owasp.org/index.php/PHP_Top_5)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/api/chat`

---

### Server-Side Template Injection

- **严重等级**: Critical (Level 4)
- **实例数量**: 1
- **CVSS 评分**: 8.3
- **CVSS 4.0 评分**: 6.9
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:L`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:L/SC:L/SI:L/SA:L`
- **标签**: code_execution, server_side_template_injection, CWE-20

**影响**:
An attacker may inject malicious template directives and possibly execute arbitrary code on the affected server.

**描述**:
This script is vulnerable to Server-side template injection attacks.
Server-side template injection occurs when user-controlled input is embedded into a server-side template, allowing users to inject template directives. This allows an attacker to inject malicious template directives and possibly execute arbitrary code on the affected server.

**修复建议**:
Templates should not be created from user-controlled input. User input should be passed to the template using template parameters.

**参考链接**:
- [Server-Side Template Injection](https://portswigger.net/blog/server-side-template-injection)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/api/chat`

---

### Cross-site Scripting

- **严重等级**: High (Level 3)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 5.1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:L/VA:N/SC:L/SI:L/SA:N`
- **标签**: xss, CWE-79

**影响**:
Malicious JavaScript has access to all the same objects as the rest of the web page, including access to cookies and local storage, which are often used to store session tokens. If an attacker can obtain a user's session cookie, they can then impersonate that user.

Furthermore, JavaScript can read and make arbitrary modifications to the contents of a page being displayed to a user. Therefore, XSS in conjunction with some clever social engineering opens up a lot of possibilities for an attacker.

**描述**:
Cross-site Scripting (XSS) refers to client-side code injection attack wherein an attacker can execute malicious scripts into a legitimate website or web application. XSS occurs when a web application makes use of unvalidated or unencoded user input within the output it generates.

**修复建议**:
Apply context-dependent encoding and/or validation to user input rendered on a page

**参考链接**:
- [Cross-site Scripting (XSS) Attack](https://invicti.com/learn/cross-site-scripting-xss/)
- [XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)
- [Excess XSS, a comprehensive tutorial on cross-site scripting](https://excess-xss.com/)
- [Cross site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting )

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog/post`

---

### Cross-site Scripting (DOM based)

- **严重等级**: High (Level 3)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 5.1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:L/VA:N/SC:L/SI:N/SA:N`
- **标签**: xss, deepscan, CWE-79

**影响**:
Malicious users may inject JavaScript, VBScript, ActiveX, HTML or Flash into a vulnerable application to fool a user in order to gather data from them.
An attacker can steal the session cookie and take over the account, impersonating the user.
It is also possible to modify the content of the page presented to the user.

**描述**:
This script is possibly vulnerable to Cross Site Scripting (XSS) attacks.
Cross site scripting (also referred to as XSS) is a vulnerability that allows an attacker to send malicious code (usually in the form of Javascript) to another user.
Because a browser cannot know if the script should be trusted or not, it will execute the script in the user context allowing the attacker to access any cookies or session tokens retained by the browser.  While a traditional cross-site scripting vulnerability occurs on the server-side code, document object model based cross-site scripting is a type of vulnerability which affects the script code in the client's browser.

**修复建议**:
Your script should filter metacharacters from user input.

**参考链接**:
- [Cross-site scripting (XSS) Attack](https://invicti.com/learn/cross-site-scripting-xss/)
- [The Cross Site Scripting Faq](https://www.cgisecurity.com/xss-faq.html)
- [OWASP DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS)
- [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
- [XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)
- [Cross site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting )
- [OWASP PHP Top 5](https://www.owasp.org/index.php/PHP_Top_5)
- [How To: Prevent Cross-Site Scripting in ASP.NET](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff649310(v=pandp.10))

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog/post`

---

### Directory traversal

- **严重等级**: High (Level 3)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 6.9
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: directory_traversal, CWE-22

**影响**:
By exploiting directory traversal vulnerabilities, attackers step out of the root directory and access files in other directories. As a result, attackers might view restricted files or execute commands, leading to a full compromise of the Web server.

**描述**:
This script is vulnerable to directory traversal attacks.Directory Traversal is a vulnerability which allows attackers to access restricted directories and read files outside of the web server's root directory.

**修复建议**:
Your script should filter metacharacters from user input.

**参考链接**:
- [Directory Traversal Attacks](https://invicti.com/learn/directory-traversal-path-traversal/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/api/chat`

---

### Local File Inclusion

- **严重等级**: High (Level 3)
- **实例数量**: 1
- **CVSS 评分**: 8.3
- **CVSS 4.0 评分**: 6.9
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:L`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:L/SC:L/SI:L/SA:L`
- **标签**: file_inclusion, CWE-20

**影响**:
It is possible for a remote attacker to include a file from local or remote resources and/or execute arbitrary script code with the privileges of the web-server.

**描述**:
This script is vulnerable to file inclusion attacks.  The script was found to reference and potentially retrieve files  from user-specified locations. User input is not sufficiently validated or sanitized prior to being passed to the vulnerable script's include function.

**修复建议**:
Edit the source code to ensure that input is properly validated. Where is possible, it is recommended to make a list of accepted filenames and restrict the input to that list.
For PHP, the option allow_url_fopen would normally allow a programmer to open, include or otherwise use a remote file using a URL rather than a local file path. It is recommended to disable this option from php.ini.

**参考链接**:
- [PHP - Using remote files](https://www.php.net/manual/en/features.remote-files.php)
- [OWASP PHP Top 5](https://www.owasp.org/index.php/PHP_Top_5)
- [Remote file inclusion](https://en.wikipedia.org/wiki/Remote_file_inclusion)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/api/chat`

---

### User controllable script source

- **严重等级**: High (Level 3)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 5.1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:L/VA:N/SC:L/SI:N/SA:N`
- **标签**: xss, CWE-79

**影响**:
An attacker can conduct XSS (cross-site scripting attacks).

**描述**:
The src parameter for one  script tag from this page is dirrectly controlled by user input. An attacker who can control the reference location to a JavaScript source file can load a script of their choice into an application.

**修复建议**:
Your script should properly sanitize user input. Do not allow user-input to control script source location references.

**参考链接**:
- [OWASP - Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [CWE-829: Inclusion of Functionality from Untrusted Control Sphere](https://cwe.mitre.org/data/definitions/829.html)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog/post`

---

### Cross frame scripting

- **严重等级**: Medium (Level 2)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 5.1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:L/VA:N/SC:N/SI:N/SA:N`
- **标签**: xfs, CWE-79

**影响**:
Malicious users may poison a frame allowing them to conduct phishing attacks.

**描述**:
This script is possibly vulnerable to Cross Frame Scripting (XFS) attacks.This is an attack technique used to trick a user into thinking that fake web site content is legitimate data.

**修复建议**:
Your script should filter metacharacters from user input.

**参考链接**:
- [Cross Frame Scripting](https://www.owasp.org/index.php/Cross_Frame_Scripting)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog/post`

---

### HTTP Strict Transport Security (HSTS) Policy Not Enabled

- **严重等级**: Medium (Level 2)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, api_misconfiguration, CWE-16

**影响**:
HSTS can be used to prevent and/or mitigate some types of man-in-the-middle (MitM) attacks

**描述**:
HTTP Strict Transport Security (HSTS) tells a browser that a web site is only accessable using HTTPS.
        
        It was detected that your web application doesn't implement HTTP Strict Transport Security (HSTS) as the Strict Transport Security header is missing from the response.

**修复建议**:
It's recommended to implement HTTP Strict Transport Security (HSTS) into your web application. Consult web references for more information

**参考链接**:
- [hstspreload.org](https://hstspreload.org/)
- [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### TLS/SSL Weak Cipher Suites

- **严重等级**: Medium (Level 2)
- **实例数量**: 1
- **CVSS 评分**: 6.5
- **CVSS 4.0 评分**: 6.9
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, weak_crypto, CWE-310

**描述**:
The remote host supports TLS/SSL cipher suites with weak or insecure properties.

**修复建议**:
Reconfigure the affected application to avoid use of weak cipher suites.

**参考链接**:
- [OWASP: TLS Cipher String Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/TLS_Cipher_String_Cheat_Sheet.html)
- [OWASP: Transport Layer Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
- [Mozilla: TLS Cipher Suite Recommendations](https://wiki.mozilla.org/Security/Server_Side_TLS)
- [SSLlabs: SSL and TLS Deployment Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)
- [RFC 9155: Deprecating MD5 and SHA-1 Signature Hashes in TLS 1.2 and DTLS 1.2](https://datatracker.ietf.org/doc/html/rfc9155)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### User controllable tag parameter (DOM-based)

- **严重等级**: Medium (Level 2)
- **实例数量**: 2
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 5.1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:L/VA:N/SC:L/SI:N/SA:N`
- **标签**: xss, CWE-79

**影响**:
An attacker can potentially conduct XSS (cross-site scripting) attacks.

**描述**:
An attacker can control one or more parameter values of a sensitive HTML tag (e.g. link href). In some conditions this can cause security issues such as XSS (cross-site scripting).

**修复建议**:
Your script should properly sanitize user input. Do not allow user-input to fully control important parameter tag values.

**参考链接**:
- [OWASP - Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [CWE-829: Inclusion of Functionality from Untrusted Control Sphere](https://cwe.mitre.org/data/definitions/829.html)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog/post`
- `https://www.sgflyingnets.com/blog/post`

---

### Cookies Not Marked as HttpOnly

- **严重等级**: Low (Level 1)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, CWE-1004

**影响**:
Cookies can be accessed by client-side scripts.

**描述**:
One or more cookies don't have the HttpOnly flag set. When a cookie is set with the HttpOnly flag, it instructs the browser that the cookie can only be accessed by the server and not by client-side scripts. This is an important security protection for session cookies.

**修复建议**:
If possible, you should set the HttpOnly flag for these cookies.

**参考链接**:
- [Cookie Not Marked as HttpOnly | Invicti](https://www.invicti.com/web-vulnerability-scanner/vulnerabilities/cookie-not-marked-as-httponly/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Cookies Not Marked as Secure

- **严重等级**: Low (Level 1)
- **实例数量**: 1
- **CVSS 评分**: 3.1
- **CVSS 4.0 评分**: 2.1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:H/AT:N/PR:N/UI:A/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, CWE-614

**影响**:
Cookies could be sent over unencrypted channels.

**描述**:
One or more cookies does not have the Secure flag set. When a cookie is set with the Secure flag, it instructs the browser that the cookie can only be accessed over secure SSL/TLS channels. This is an important security protection for session cookies.

**修复建议**:
If possible, you should set the Secure flag for these cookies.

**参考链接**:
- [SameSite None Cookie Not Marked as Secure - Invicti](https://www.invicti.com/web-vulnerability-scanner/vulnerabilities/samesite-none-cookie-not-marked-as-secure/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Cookies with missing, inconsistent or contradictory properties

- **严重等级**: Low (Level 1)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, CWE-284

**影响**:
Cookies will not be stored, or submitted, by web browsers.

**描述**:
At least one of the following cookies properties causes the cookie to be invalid or incompatible with either a different property of the same cookie, of with the environment the cookie is being used in. Although this is not a vulnerability in itself, it will likely lead to unexpected behavior by the application, which in turn may cause secondary security issues.

**修复建议**:
Ensure that the cookies configuration complies with the applicable standards.

**参考链接**:
- [MDN | Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [Securing cookies with cookie prefixes](https://www.sjoerdlangkemper.nl/2017/02/09/cookie-prefixes/)
- [Cookies: HTTP State Management Mechanism](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-05)
- [SameSite Updates - The Chromium Projects](https://www.chromium.org/updates/same-site)
- [draft-west-first-party-cookies-07: Same-site Cookies](https://tools.ietf.org/html/draft-west-first-party-cookies-07)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Insecure Frame (External)

- **严重等级**: Low (Level 1)
- **实例数量**: 1
- **CVSS 评分**: 5.1
- **CVSS 4.0 评分**: 1.8
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:H/PR:H/UI:R/S:C/C:L/I:L/A:L`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:H/AT:N/PR:H/UI:A/VC:L/VI:L/VA:L/SC:L/SI:L/SA:L`
- **标签**: xfs, CWE-829

**影响**:
When a web page uses an insecurely configured iframe to embed another web page, the latter may manipulate the former, and trick its visitors into performing unwanted actions.

**描述**:
The web page was found to be using an Inline Frame ("iframe") to embed a resource, such as a different web page. The Inline Frame is either configured insecurely, or not as securely as expected.  This vulnerability alert is based on the origin of the embedded resource and the iframe's sandbox attribute, which can be used to apply security restrictions as well as exceptions to these restrictions.

**修复建议**:
Review the iframe's purpose and environment, and use the sandbox attribute to secure the iframe while applying sandbox directives to ease security restrictions if necessary.

**参考链接**:
- [MDN | iframe: The Inline Frame Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [HTML Standard: iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)
- [HTML 5.2: 4.7. Embedded content](https://www.w3.org/TR/html52/semantics-embedded-content.html#element-attrdef-iframe-sandbox)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/blog`

---

### [Possible] Internal Path Disclosure (*nix)

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 评分**: 5.3
- **CVSS 4.0 评分**: 6.9
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: information_disclosure, CWE-200

**影响**:
Possible sensitive information disclosure.

**描述**:
One or more fully qualified path names were found. From this information the attacker may learn the file system structure from the web server. This information can be used to conduct further attacks.This alert may be a false positive, manual confirmation is required.

**修复建议**:
Prevent this information from being displayed to the user.

**参考链接**:
- [Full Path Disclosure](https://www.owasp.org/index.php/Full_Path_Disclosure)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Content Security Policy (CSP) Not Implemented

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, api_misconfiguration, CWE-16

**影响**:
CSP can be used to prevent and/or mitigate attacks that involve content/code injection, such as cross-site scripting/XSS attacks, attacks that require embedding a malicious resource, attacks that involve malicious use of iframes, such as clickjacking attacks, and others.

**描述**:
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. 

Content Security Policy (CSP) can be implemented by adding a Content-Security-Policy header. The value of this header is a string containing the policy directives describing your Content Security Policy. To implement CSP, you should define lists of allowed origins for the all of the types of resources that your site utilizes. For example, if you have a simple site that needs to load scripts, stylesheets, and images hosted locally, as well as from the jQuery library from their CDN, the CSP header could look like the following:


Content-Security-Policy:
    default-src 'self';
    script-src 'self' https://code.jquery.com;




It was detected that your web application doesn't implement Content Security Policy (CSP) as the CSP header is missing from the response. It's recommended to implement Content Security Policy (CSP) into your web application.

**修复建议**:
It's recommended to implement Content Security Policy (CSP) into your web application. Configuring Content Security Policy involves adding the Content-Security-Policy HTTP header to a web page and giving it values to control resources the user agent is allowed to load for that page.

**参考链接**:
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Implementing Content Security Policy](https://hacks.mozilla.org/2016/02/implementing-content-security-policy/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Generic Email Address Disclosure

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: information_disclosure, CWE-200

**影响**:
Email addresses posted on Web sites may attract spam.

**描述**:
One or more email addresses have been found on this website. The majority of spam comes from email addresses harvested off the internet. The spam-bots (also known as email harvesters and email extractors) are programs that scour the internet looking for email addresses on any website they come across.  Spambot programs look for strings like myname@mydomain.com and then record any addresses found.

**修复建议**:
Check references for details on how to solve this problem.

**参考链接**:
- [Anti-spam techniques](https://en.wikipedia.org/wiki/Anti-spam_techniques)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Javascript Source map detected

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: information_disclosure, CWE-16

**影响**:
Access to source maps may help an attacker to read and debug Javascript code. It simplifies finding client-side vulnerabilities

**描述**:
Client side Javascript source code can be combined, minified or compiled. A source map is a file that maps from the transformed source to the original source. 
        Source map may help an attacker to read and debug Javascript.

**修复建议**:
According to the best practices, source maps should not be accesible for an attacker. Consult web references for more information

**参考链接**:
- [Using sourcemaps on production without exposing the source code](https://itnext.io/using-sourcemaps-on-production-without-revealing-the-source-code-%EF%B8%8F-d41e78e20c89)
- [SPA source code recovery by un-Webpacking source maps](https://medium.com/@rarecoil/spa-source-code-recovery-by-un-webpacking-source-maps-ef830fc2351d)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Outdated JavaScript libraries

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:H/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: missing_update, CWE-937

**影响**:
Consult References for more information.

**描述**:
You are using an outdated version of one or more JavaScript libraries. A more recent version is available. Although your version was not found to be affected by any security vulnerabilities, it is recommended to keep libraries up to date.

**修复建议**:
Upgrade to the latest version.

**参考链接**:
- [How Invicti identifies Out-of-date technologies](https://www.invicti.com/support/how-invicti-identifies-outofdate/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### Permissions-Policy header not implemented

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration, api_misconfiguration, CWE-1021

**描述**:
The Permissions-Policy header allows developers to selectively enable and disable use of various browser features and APIs.

**参考链接**:
- [Permissions-Policy / Feature-Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy)
- [Permissions Policy (W3C)](https://www.w3.org/TR/permissions-policy-1/)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

### X-Content-Type-Options (XCTO) Not Implemented

- **严重等级**: Informational (Level 0)
- **实例数量**: 1
- **CVSS 3.0 向量**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:N/I:N/A:N`
- **CVSS 4.0 向量**: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
- **标签**: configuration

**影响**:
XCTO header can be used as an additional layer of defense to prevent various attacks, such as Cross-Site Scripting (XSS), Cross-Site Script Inclusion (XSSI), side channel attacks, and others.

**描述**:
MIME type sniffing is a standard functionality in browsers to find an appropriate way to render data where the HTTP headers sent by the server are either inconclusive or missing. This allows web browsers to perform MIME-Sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the intended content type.  
X-Content-Type-Options (XCTO) is an HTTP header that can be used to prevent MIME type sniffing, which can help to mitigate certain types of attacks, including Cross Site Scripting (XSS). It also enables Cross-Origin Read Blocking (CORB) for sensitive resources, helping protect against Cross-Site Script Inclusion (XSSI) and side channel attacks.

**修复建议**:
Add the X-Content-Type-Options header with a value of "nosniff" to inform the browser to trust what the site has sent is the appropriate content-type, and to not attempt "sniffing" the real content-type.

**参考链接**:
- [X-Content-Type-Options header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
- [Cross-Origin Read Blocking (CORB)](https://chromium.googlesource.com/chromium/src/+/HEAD/services/network/cross_origin_read_blocking_explainer.md)

**分类**: wvs

**受影响的URL**:

- `https://www.sgflyingnets.com/`

---

## 扫描覆盖范围

共发现 306 个位置/路径。

### 发现的路径

- `https://www.sgflyingnets.com/`
  - `__nextjs_original-stack-frame`
  - `_next`
  - `_next`
    - `static`
    - `static`
    - `webpack-hmr`
  - `about`
  - `admin`
  - `admin`
    - `about`
    - `account`
    - `ai`
    - `ai`
    - `certifications`
    - `config`
    - `contact`
    - `hero`
    - `layout`
    - `login`
    - `materials`
    - `media`
    - `offices`
    - `partnerships`
    - `products`
    - `services`
    - `stats`
    - `stories`
    - `submissions`
    - `sync`
  - `ai-assistant-widget.js`
  - `api`
  - `api`
    - `admin`
    - `ai`
    - `ai`
    - `auth`
    - `auth`
    - `blog`
    - `chat`
    - `content`
    - `content`
    - `events`
    - `submissions`
    - `submit`
    - `submit`
    - `sync`
    - `sync`
    - `token-usage`
    - `upload`
  - `blog`
  - `blog`
    - `post`
  - `cases`
  - `certifications`
  - `contact`
  - `images`
  - `images`
  - `nxt`
    - `static`
  - `partnership`
  - `products`
  - `products`
    - `all-soc`
    - `assa`
    - `synergy-ai`
  - ... 及其他 4 个路径
