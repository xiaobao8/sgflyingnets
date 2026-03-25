# 备份恢复指南

## 当前备份（最新版本，恢复以此为准）

- **文件**：`HP-backup-20260315-182709.tar.gz`
- **创建时间**：2026-03-15
- **说明**：项目完整备份（已排除 node_modules、.next、.git 等）

---

## 恢复步骤

### 1. 解压到新目录

```bash
# 创建恢复目录
mkdir -p /path/to/restore
cd /path/to/restore

# 解压备份（将路径替换为实际备份文件路径）
tar -xzvf /path/to/HP/backups/HP-backup-20260315-182709.tar.gz
```

### 2. 安装依赖并启动

```bash
npm install
npm run orbstack   # 或 npm run preview
```

### 3. 数据说明

- `data/content.json`：网站内容、配置、管理员
- `data/submissions.json`：表单提交记录（若存在）

恢复后请检查 `data/` 目录是否完整。

---

## 对外地址

- **官网**：http://localhost:3000 或 http://flyingnets.hp.orb.local
- **管理后台**：http://localhost:3000/admin
- **默认账号**：admin / 初始密码见仓库 `README`（或 `ADMIN_INITIAL_PASSWORD`）
