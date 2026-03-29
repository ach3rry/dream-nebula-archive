# 部署文档

> 梦境星云档案馆 - 部署指南
> 最后更新：2026-03-29

---

## 📋 目录

1. [本地开发环境](#本地开发环境)
2. [Docker 部署](#docker-部署)
3. [云服务器部署](#云服务器部署)
4. [Vercel 部署](#vercel-部署)

---

## 本地开发环境

### 前置要求

- Node.js 18+
- Python 3.9+
- Docker Desktop
- YashanDB 23.4+

### 启动步骤

```bash
# 1. 启动 YashanDB
docker run -d \
  -p 1688:1688 \
  -e SYS_PASSWD=Cod-2022 \
  --name yashandb \
  docker.1ms.run/yasdb/yashandb:23.4.7.100

# 2. 安装 Python 驱动
# 使用 /yashandb-python 技能安装 yaspy

# 3. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 填入 DeepSeek API 密钥

# 4. 启动后端
cd backend
pip install -r requirements.txt
python main.py

# 5. 启动前端
npm install
npm run dev
```

---

## Docker 部署

### docker-compose.yml

项目已提供 `docker-compose.yml`，一键启动所有服务：

```bash
docker-compose up -d
```

**包含服务**：
- YashanDB 数据库
- FastAPI 后端
- Next.js 前端

---

## 云服务器部署

### 阿里云部署

详见 [ALIYUN_QUICK_START.md](../ALIYUN_QUICK_START.md)

**快速步骤**：

1. 购买 ECS 服务器
2. 安装 Docker
3. 部署 YashanDB 容器
4. 部署后端服务
5. 部署前端（使用 Nginx）

---

## Vercel 部署

### 自动部署

项目已配置 Vercel，推送代码自动部署：

```bash
git push origin main
```

**访问地址**: https://dream-nebula-archive.vercel.app

### 环境变量配置

在 Vercel 控制台配置：

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Demo 模式下使用 32 条预设梦境，无需后端服务。

---

## 配置说明

### DeepSeek API

```bash
# 获取 API Key
访问 https://platform.deepseek.com/

# 配置到 .env
DEEPSEEK_API_KEY=your_api_key_here
```

### YashanDB 密码

```bash
# Docker 部署
-e SYS_PASSWD=Cod-2022

# 或在数据库中修改
ALTER USER system IDENTIFIED BY "new_password";
```

---

**维护**: 本文档整合了原有的 CLOUD_DEPLOYMENT.md、DEPLOYMENT.md、ALIYUN_QUICK_START.md
