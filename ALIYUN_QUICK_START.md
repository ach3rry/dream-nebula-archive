# 阿里云快速部署指南

本指南帮助你在**30分钟内**将完整版部署到阿里云学生机（¥10/月）。

---

## 🚀 快速开始

### 第一步：购买云服务器

**阿里云学生机：**
1. 访问：https://www.aliyun.com/daily-act/campus/student
2. 选择配置：
   - CPU：1核
   - 内存：2GB
   - 带宽：1Mbps
   - 系统：**Ubuntu 20.04**
3. 价格：¥9.9/月
4. 完成！记下你的：
   - 服务器公网IP
   - 登录密码（或SSH密钥）

### 第二步：连接服务器

**Windows 用户：**
```bash
# 使用 PowerShell
ssh root@你的服务器IP

# 输入密码
```

**Mac/Linux 用户：**
```bash
ssh root@你的服务器IP
```

### 第三步：一键部署脚本

复制以下命令，在服务器上执行：

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh

# 2. 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 3. 克隆代码
git clone https://github.com/ach3rry/dream-nebula-archive.git
cd dream-nebula-archive

# 4. 配置环境变量
cat > backend/.env << 'EOF'
# YashanDB 配置
YASHANDB_HOST=yashandb
YASHANDB_PORT=1688
YASHANDB_USER=system
YASHANDB_PASSWORD=Cod-2022

# DeepSeek API
DEEPSEEK_API_KEY=你的DeepSeek_API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
EOF

# 5. 编辑 DeepSeek API 密钥
nano backend/.env
# 把 "你的DeepSeek_API密钥" 替换成真实的密钥
# 按 Ctrl+X，然后 Y，然后 Enter 保存

# 6. 启动所有服务
docker-compose up -d

# 7. 查看服务状态
docker-compose ps
```

**完成！** 等待1-2分钟，服务启动完成。

---

## ✅ 验证部署

### 检查服务状态

```bash
# 查看所有容器
docker-compose ps

# 应该看到3个服务都是 "Up" 状态：
# yashandb    Up
# backend     Up
# nginx       Up
```

### 测试服务

```bash
# 测试 YashanDB
curl http://localhost:1688

# 测试后端 API
curl http://localhost:8000/health

# 应该返回：
# {"status":"healthy","service":"Dream Nebula Archive API",...}
```

### 访问网站

在浏览器打开：

**后端 API：**
```
http://你的服务器IP:8000/docs
```

**前端（如果部署了）：**
```
http://你的服务器IP
```

---

## 🔧 配置前端（可选）

如果你想让前端也部署在阿里云：

### 方式一：直接使用 Vercel（推荐）

前端部署在 Vercel，后端在阿里云：

1. Vercel 设置环境变量：
   ```
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_API_URL=http://你的服务器IP:8000
   ```

2. 重新部署 Vercel

3. 访问：https://dream-nebula-archive.vercel.app

### 方式二：前后端都在阿里云

需要配置 Nginx，见下方高级配置。

---

## 📊 当前可用功能

### ✅ 已完成功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 创建梦境 | ✅ | POST /api/dreams |
| 查看梦境列表 | ✅ | GET /api/dreams |
| 查看梦境详情 | ✅ | GET /api/dreams/{id} |
| AI 情感分析 | ✅ | POST /api/analysis/emotion |
| 梦境解读 | ✅ | POST /api/interpretation/analyze |
| 星云生成 | ✅ | POST /api/analysis/nebula |
| 关键词提取 | ✅ | POST /api/analysis/keywords |
| 前端页面 | ✅ | 所有页面完整 |

### 🔧 需要配置的

1. **DeepSeek API 密钥**
   - 必须配置，否则 AI 功能无法使用
   - 配置位置：`backend/.env`

2. **CORS 配置**（如果用 Vercel 前端）
   - 编辑 `backend/main.py`
   - 添加你的 Vercel 域名

---

## 🎯 完整部署架构

```
┌──────────────────────────────────────┐
│   阿里云服务器                        │
│   ┌────────────────────────────────┐ │
│   │ Nginx (端口80)                 │ │
│   │  反向代理                       │ │
│   └──────────┬─────────────────────┘ │
│              │                        │
│   ┌──────────▼─────────────────────┐ │
│   │ FastAPI 后端 (端口8000)        │ │
│   │  - AI 分析                     │ │
│   │  - 梦境 CRUD                   │ │
│   └──────────┬─────────────────────┘ │
│              │                        │
│   ┌──────────▼─────────────────────┐ │
│   │ YashanDB (端口1688)            │ │
│   │  - 数据存储                    │ │
│   └────────────────────────────────┘ │
└──────────────────────────────────────┘
         │
         │ HTTP
         ▼
┌──────────────────────────────────────┐
│   Vercel 前端 (可选)                 │
│   https://dream-nebula-archive...    │
└──────────────────────────────────────┘
```

---

## 🐛 常见问题

### 1. Docker 安装失败

```bash
# 使用国内镜像
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

### 2. 无法访问服务器

```bash
# 检查防火墙
# 阿里云控制台 → 安全组 → 添加规则：
# 端口：80, 8000, 1688
# 授权对象：0.0.0.0/0
```

### 3. YashanDB 连接失败

```bash
# 查看日志
docker-compose logs yashandb

# 重启 YashanDB
docker-compose restart yashandb
```

### 4. AI 分析不工作

```bash
# 检查 API 密钥
docker-compose exec backend env | grep DEEPSEEK

# 重新配置
nano backend/.env
docker-compose restart backend
```

---

## 📝 快速命令参考

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 重启服务
docker-compose restart backend

# 停止所有服务
docker-compose down

# 更新代码
git pull
docker-compose up -d --build
```

---

## 💰 成本

| 项目 | 费用 |
|------|------|
| 阿里云学生机 | ¥9.9/月 |
| YashanDB | 免费 |
| DeepSeek API | 按使用计费 |
| **总计** | **约¥10/月** |

---

## 🎉 完成！

你的完整版梦境星云档案馆已经部署在阿里云上了！

**访问地址：**
- 后端 API：`http://你的服务器IP:8000/docs`
- 前端：配置 Vercel 指向 `http://你的服务器IP:8000`

**下一步：**
1. 测试所有功能
2. 录制演示视频
3. 提交作品

---

**遇到问题？** 查看 `CLOUD_DEPLOYMENT.md` 详细文档
