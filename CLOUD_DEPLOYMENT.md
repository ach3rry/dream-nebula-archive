# 云服务器部署指南

本指南帮助你将梦境星云档案馆完整部署到云服务器（阿里云/腾讯云）。

## 方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **Docker Compose** | 一键部署，易于管理 | 需要安装Docker | ⭐⭐⭐⭐⭐ |
| **手动部署** | 更灵活，可控性强 | 配置复杂，易出错 | ⭐⭐⭐ |
| **Render后端+云DB** | 后端托管简单 | 需要两台服务器 | ⭐⭐⭐⭐ |

## 推荐方案：Docker Compose 一体化部署

### 前置要求

- 云服务器（阿里云/腾讯云学生机：¥10/月）
- 服务器配置：至少 1核2G
- 操作系统：Ubuntu 20.04 或 CentOS 7+
- YashanDB C驱动和Python驱动
- DeepSeek API 密钥

### 部署步骤

#### 1. 购买云服务器

**阿里云学生机：**
- 访问：https://www.aliyun.com/daily-act/campus/student
- 配置：1核2G，1Mbps带宽
- 价格：¥9.9/月
- 系统：Ubuntu 20.04

**腾讯云学生机：**
- 访问：https://cloud.tencent.com/act/campus
- 配置：1核2G，1Mbps带宽
- 价格：¥10/月
- 系统：Ubuntu 20.04

#### 2. 服务器初始化

```bash
# SSH连接到服务器
ssh root@你的服务器IP

# 更新系统
apt update && apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com | sh

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 3. 安装YashanDB Python驱动

```bash
# 在服务器上创建工作目录
mkdir -p /root/dream-nebula
cd /root/dream-nebula

# 下载YashanDB Python驱动
# 访问：https://download.yashandb.com
# 下载对应平台的 yaspy whl 文件
# 上传到服务器后安装：
pip install yaspy-*.whl
```

#### 4. 克隆代码

```bash
# 克隆代码
git clone https://github.com/ach3rry/dream-nebula-archive.git
cd dream-nebula-archive
```

#### 5. 配置环境变量

```bash
# 创建环境变量文件
cp backend/.env.example backend/.env

# 编辑 backend/.env，填入你的配置
nano backend/.env
```

`.env` 文件内容：
```env
# YashanDB配置
YASHANDB_HOST=yashandb
YASHANDB_PORT=1688
YASHANDB_USER=system
YASHANDB_PASSWORD=Cod-2022

# DeepSeek API
DEEPSEEK_API_KEY=你的API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

#### 6. 启动服务

```bash
# 一键启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 7. 初始化数据库

```bash
# 进入后端容器
docker-compose exec backend bash

# 初始化数据库表结构
python -c "
from database.connection import get_connection
conn = get_connection()
cursor = conn.cursor()
# 执行建表SQL（见 backend/database/migrations.sql)
conn.commit()
conn.close()
"

# 退出容器
exit
```

#### 8. 验证部署

```bash
# 检查YashanDB
curl http://localhost:1688

# 检查后端API
curl http://localhost:8000/health

# 检查前端（如果部署了）
curl http://localhost/
```

#### 9. 配置域名（可选）

```bash
# 安装Nginx
apt install nginx -y

# 配置反向代理
nano /etc/nginx/sites-available/dream-nebula
```

Nginx配置：
```nginx
server {
    listen 80;
    server_name 你的域名.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# 启用配置
ln -s /etc/nginx/sites-available/dream-nebula /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 方案二：分离部署

如果你想让前端在Vercel，后端在云服务器：

### 1. 云服务器部署 YashanDB + 后端

```bash
# 只启动YashanDB和后端
docker-compose up -d yashandb backend
```

### 2. 配置Vercel前端

在Vercel设置环境变量：
```
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://你的服务器IP:8000
# 或使用域名
# NEXT_PUBLIC_API_URL=https://你的域名.com
```

### 3. 配置CORS

修改 `backend/main.py`，添加Vercel域名到CORS：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dream-nebula-archive.vercel.app"  # 添加你的Vercel域名
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 重启服务
docker-compose restart backend

# 停止所有服务
docker-compose down

# 更新代码后重新部署
git pull
docker-compose up -d --build
```

## 故障排除

### YashanDB 连接失败

```bash
# 检查YashanDB容器状态
docker-compose logs yashandb

# 重启YashanDB
docker-compose restart yashandb

# 检查端口
netstat -tuln | grep 1688
```

### 后端无法启动

```bash
# 查看后端日志
docker-compose logs backend

# 检查环境变量
docker-compose exec backend env

# 进入容器调试
docker-compose exec backend bash
```

### API 调用失败

```bash
# 检查网络连接
curl http://localhost:8000/health

# 检查DeepSeek API密钥
docker-compose exec backend env | grep DEEPSEEK
```

## 成本估算

| 项目 | 费用 |
|------|------|
| 阿里云学生机 | ¥9.9/月 |
| 腾讯云学生机 | ¥10/月 |
| YashanDB | 免费 |
| DeepSeek API | 按使用计费 |
| **总计** | **约¥10/月** |

## 安全建议

1. **修改默认密码**
   ```bash
   # 修改YashanDB密码
   docker-compose exec yashandb yasql system/Cod-2022
   ```

2. **配置防火墙**
   ```bash
   # 只开放必要端口
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```

3. **使用HTTPS**
   ```bash
   # 安装Certbot
   apt install certbot python3-certbot-nginx -y

   # 获取SSL证书
   certbot --nginx -d 你的域名.com
   ```

## 下一步

- [ ] 购买云服务器
- [ ] 安装Docker和Docker Compose
- [ ] 克隆代码
- [ ] 配置环境变量
- [ ] 启动服务
- [ ] 测试API
- [ ] 配置域名
- [ ] 录制演示视频

需要帮助随时联系！
