
#!/usr/bin/env bash

# 遇到错误立即退出
# 使用未定义变量时报错
# 管道中任何命令失败都视为失败
set -Eeuo pipefail

# ==============================
# 1. 基础配置
# ==============================

APP_DIR="/var/www/english-teaching-platform"
BRANCH="main"
SERVICE_NAME="english-teaching-platform"

echo "======================================"
echo "开始部署英语教学平台"
echo "======================================"

# ==============================
# 2. 进入项目目录
# ==============================

cd "$APP_DIR"

echo ""
echo "[1/6] 拉取最新代码"

git -c http.version=HTTP/1.1 pull --ff-only origin "$BRANCH"

# ==============================
# 3. 安装项目依赖
# ==============================

echo ""
echo "[2/6] 安装项目依赖"

pnpm install --frozen-lockfile

# ==============================
# 4. 执行数据库迁移
# ==============================

echo ""
echo "[3/6] 执行 Prisma 数据库迁移"

pnpm exec prisma migrate deploy --config prisma7.config.ts

# ==============================
# 5. 生成 Prisma Client
# ==============================

echo ""
echo "[4/6] 生成 Prisma Client"

pnpm exec prisma generate --config prisma7.config.ts

# ==============================
# 6. 构建 Next.js 项目
# ==============================

echo ""
echo "[5/6] 构建 Next.js 项目"

pnpm build

# ==============================
# 7. 重启应用服务
# ==============================

echo ""
echo "[6/6] 重启应用服务"

sudo -n systemctl restart "$SERVICE_NAME"

# 检查服务状态
sudo -n systemctl is-active --quiet "$SERVICE_NAME"

# 检查本机应用是否可以访问
curl --fail --silent --show-error \
  --max-time 10 \
  http://127.0.0.1:3000/ \
  --output /dev/null

echo ""
echo "======================================"
echo "部署成功！"
echo "======================================"
