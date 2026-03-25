# Flyingnets 公司官网

## 启动方式

### 方式一：本地运行（推荐，稳定）

```bash
cd /Users/mac/Desktop/开发/HP
npm run local
```

然后在浏览器打开 **http://localhost:3000**

### 方式二：OrbStack / Docker

```bash
cd /Users/mac/Desktop/开发/HP
npm run orbstack
```

若出现「Loading chunk failed」或 400 错误，请改用方式一（本地运行）。

---

## 管理后台

- 地址：http://localhost:3000/admin
- 用户名：`admin`；初始密码：`EoMYW5wsaKDS3rPa890CVLpIhlNe`（可通过环境变量 `ADMIN_INITIAL_PASSWORD` 覆盖；登录后建议尽快修改）
