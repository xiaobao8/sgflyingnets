# 使用 OrbStack 部署 Flyingnets 官网

OrbStack 兼容 Docker，可直接使用以下方式部署。

> 若遇到「missing required error components」或无法访问，请确保已执行最新代码并重新构建。

## 方式一：Docker Compose（推荐）

```bash
cd /Users/mac/Desktop/开发/HP

# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f
```

访问 http://localhost:3000

## 方式二：纯 Docker 命令

```bash
cd /Users/mac/Desktop/开发/HP

# 构建镜像
docker build -t flyingnets-website .

# 运行容器（数据持久化到 volume）
docker run -d \
  --name flyingnets \
  -p 3000:3000 \
  -v flyingnets-data:/app/data \
  --restart unless-stopped \
  flyingnets-website
```

## 常用命令

| 操作 | 命令 |
|------|------|
| 停止 | `docker compose down` |
| 重启 | `docker compose restart` |
| 查看日志 | `docker compose logs -f` |
| 进入容器 | `docker compose exec flyingnets sh` |

## 数据持久化

- 内容数据存储在 Docker volume `flyingnets-data` 中
- 容器删除后，执行 `docker volume rm flyingnets-data` 才会清除数据
- 首次启动会自动执行 `db:seed` 初始化数据

## 环境变量（可选）

创建 `.env` 文件可覆盖默认配置：

```
JWT_SECRET=your-secure-secret-key
```

### 表单邮件自动发送

若需在用户提交联系表单或合作登记后自动发送邮件到指定邮箱，需配置 SMTP 环境变量：

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

并在管理后台「网站配置」中设置 `contact_email`（联系表单接收邮箱）和 `partnership_email`（合作登记接收邮箱）。
