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
HEALTH_URL="http://127.0.0.1:3000/admin/users"

# 拉取代码最大重试次数（国内服务器访问 GitHub 不稳定）
PULL_RETRIES=5
# 等待服务就绪的最大检查次数（每次间隔 2 秒）
HEALTH_RETRIES=30

echo "======================================"
echo "开始部署英语教学平台"
echo "======================================"

# ==============================
# 2. 进入项目目录
# ==============================

cd "$APP_DIR"

echo ""
echo "[1/6] 拉取最新代码"

for i in $(seq 1 "$PULL_RETRIES"); do
  if git -c http.version=HTTP/1.1 pull --ff-only origin "$BRANCH"; then
    break
  fi

  if [ "$i" -eq "$PULL_RETRIES" ]; then
    echo "拉取代码失败，已重试 ${PULL_RETRIES} 次"
    exit 1
  fi

  echo "拉取失败，10 秒后重试（第 ${i} 次）"
  sleep 10
done

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

# 等待服务就绪
# systemctl restart 返回时进程刚启动，端口不一定已经开始监听，
# 所以不能立即检查，需要循环等待
echo "等待服务就绪..."

for i in $(seq 1 "$HEALTH_RETRIES"); do
  if curl --fail --silent --show-error \
    --max-time 10 \
    "$HEALTH_URL" \
    --output /dev/null 2>/dev/null; then
    echo "服务已就绪（第 ${i} 次检查）"
    break
  fi

  if [ "$i" -eq "$HEALTH_RETRIES" ]; then
    echo "服务启动超时（等待约 $((HEALTH_RETRIES * 2)) 秒）"
    echo "请登录服务器查看日志：journalctl -u ${SERVICE_NAME} -n 50 --no-pager"
    exit 1
  fi

  sleep 2
done

echo ""
echo "======================================"
echo "部署成功！"
echo "======================================"