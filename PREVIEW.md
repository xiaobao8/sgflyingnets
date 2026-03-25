# 网站预览指南

## 地址与登录凭证

| 用途 | 地址 | 说明 |
|------|------|------|
| **对外展示** | http://localhost:3000 | 访客访问的官网首页 |
| **管理后台** | http://localhost:3000/admin | 需登录后使用 |
| **登录页** | http://localhost:3000/admin/login | 管理后台登录入口 |

**默认管理员账号**（首次部署后请尽快修改）：
- 用户名：`admin`
- 密码：`EoMYW5wsaKDS3rPa890CVLpIhlNe`（或通过环境变量 `ADMIN_INITIAL_PASSWORD` 指定）

---

## 推荐：本地预览（无需 Docker）

```bash
cd /Users/mac/Desktop/开发/HP
npm run preview
```

- 每次运行会**完整清理并重新构建**，避免 chunk 缺失错误
- 构建约 1 分钟，完成后在浏览器打开 **http://localhost:3000**
- 管理后台：http://localhost:3000/admin（凭据见上表）

**注意**：请使用 `npm run preview`，不要使用 `npm run dev`。开发模式在部分环境下可能产生 "Cannot find module" 错误。

---

## 备选：OrbStack 部署

```bash
cd /Users/mac/Desktop/开发/HP
npm run orbstack
```

- **对外展示**：http://localhost:3000 或 http://flyingnets.hp.orb.local
- **管理后台**：http://localhost:3000/admin 或 http://flyingnets.hp.orb.local/admin
