# 梦境星云档案馆 - Render演示版后端

这是梦境星云档案馆项目的演示版后端，专为部署到 [Render](https://render.com) 而设计。

## 功能特性

- ✅ AI 情感分析
- ✅ 关键词提取
- ✅ 星云参数生成
- ✅ 梦境解读 (赛博周公)

**注意：** 这是演示版后端，只提供AI分析功能。完整的数据存储需要YashanDB数据库。

## 快速部署到 Render

### 方式一：通过 Render Dashboard 部署

1. 访问 [render.com](https://render.com)
2. 使用 GitHub 账号登录
3. 点击 "New +" → "Web Service"
4. 连接你的 GitHub 仓库
5. 选择 `backend-render` 目录作为根目录
6. 配置如下：

```
环境: Python 3
构建命令: pip install -r requirements.txt
启动命令: uvicorn main:app --host 0.0.0.0 --port $PORT
```

7. 添加环境变量：
   ```
   DEEPSEEK_API_KEY=你的DeepSeek_API密钥
   DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
   ```

8. 点击 "Create Web Service"

### 方式二：通过 render.yaml 部署

1. Fork 本仓库到你的 GitHub
2. 访问 [render.com](https://render.com)
3. 点击 "New +" → "Blueprint"
4. 连接你的 Fork
5. 选择 `backend-render/render.yaml`
6. 配置环境变量
7. 点击 "Apply Blueprint"

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API 密钥 |
| `DEEPSEEK_BASE_URL` | ❌ | API 基础URL（默认：https://api.deepseek.com/v1） |

## API 端点

部署成功后，你的后端将提供以下端点：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/` | GET | 服务信息 |
| `/api/analysis/emotion` | POST | 情感分析 |
| `/api/analysis/keywords` | POST | 关键词提取 |
| `/api/analysis/nebula` | POST | 星云生成 |
| `/api/interpretation/analyze` | POST | 梦境解读 |
| `/docs` | GET | API 文档 (Swagger) |

## 本地运行

```bash
# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 DeepSeek API 密钥

# 启动服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 访问 API 文档
open http://localhost:8000/docs
```

## 与前端集成

部署成功后，你会获得一个类似 `https://你的应用名.onrender.com` 的 URL。

在前端项目中配置环境变量：

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://你的应用名.onrender.com
```

## 注意事项

1. **免费版休眠：** Render 免费版在 15 分钟无活动后会休眠，第一次访问需要等待 30-60 秒启动。

2. **API 密钥安全：** 不要在代码中硬编码 API 密钥，始终使用环境变量。

3. **请求超时：** AI 分析可能需要几秒钟，建议前端设置合理的超时时间。

## 故障排除

### 服务无法启动
- 检查 Render 构建日志
- 确认所有依赖都正确安装
- 验证环境变量配置正确

### API 调用失败
- 确认 DEEPSEEK_API_KEY 已正确设置
- 检查 API 密钥是否有效
- 查看 Render 服务日志

### 前端无法连接
- 确认 CORS 配置正确（演示版允许所有来源）
- 检查 API URL 配置
- 验证网络连接

## 技术栈

- **FastAPI** - Web 框架
- **Uvicorn** - ASGI 服务器
- **Pydantic** - 数据验证
- **httpx** - HTTP 客户端
- **DeepSeek API** - AI 服务

## 许可证

MIT License
