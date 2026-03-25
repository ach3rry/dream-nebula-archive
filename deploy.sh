#!/bin/bash

# 梦境星云档案馆 - 一键部署脚本
# 适用于 Ubuntu 20.04/22.04

set -e

echo "🌌 梦境星云档案馆 - 一键部署脚本"
echo "================================"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 用户运行此脚本"
    exit 1
fi

# 步骤 1: 更新系统
echo ""
echo "📦 步骤 1/7: 更新系统..."
apt update && apt upgrade -y

# 步骤 2: 安装 Docker
echo ""
echo "🐳 步骤 2/7: 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
else
    echo "Docker 已安装，跳过..."
fi

# 步骤 3: 安装 Docker Compose
echo ""
echo "🔧 步骤 3/7: 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose 已安装，跳过..."
fi

# 步骤 4: 克隆代码
echo ""
echo "📥 步骤 4/7: 克隆代码..."
if [ ! -d "dream-nebula-archive" ]; then
    git clone https://github.com/ach3rry/dream-nebula-archive.git
    cd dream-nebula-archive
else
    echo "代码已存在，拉取最新代码..."
    cd dream-nebula-archive
    git pull
fi

# 步骤 5: 配置环境变量
echo ""
echo "⚙️  步骤 5/7: 配置环境变量..."
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << 'EOF'
# YashanDB 配置
YASHANDB_HOST=yashandb
YASHANDB_PORT=1688
YASHANDB_USER=system
YASHANDB_PASSWORD=Cod-2022

# DeepSeek API（需要手动配置）
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
EOF
    echo "✅ 环境变量文件已创建：backend/.env"
    echo "⚠️  请手动编辑此文件，填入你的 DeepSeek API 密钥"
    echo "   命令: nano backend/.env"
else
    echo "环境变量文件已存在，跳过..."
fi

# 步骤 6: 初始化 YashanDB
echo ""
echo "💾 步骤 6/7: 初始化 YashanDB..."
# 创建数据目录
mkdir -p /root/yashan/data /root/yashan/yasboot

# 步骤 7: 启动服务
echo ""
echo "🚀 步骤 7/7: 启动服务..."
docker-compose up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动（30秒）..."
sleep 30

# 检查服务状态
echo ""
echo "📊 服务状态："
docker-compose ps

# 显示访问信息
echo ""
echo "================================"
echo "🎉 部署完成！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   后端 API: http://$(curl -s ifconfig.me):8000/docs"
echo "   前端: 配置 Vercel 指向 http://$(curl -s ifconfig.me):8000"
echo ""
echo "📝 下一步："
echo "   1. 配置 DeepSeek API 密钥: nano backend/.env"
echo "   2. 重启后端: docker-compose restart backend"
echo "   3. 查看日志: docker-compose logs -f backend"
echo ""
echo "📖 查看完整文档: cat ALIYUN_QUICK_START.md"
echo ""
