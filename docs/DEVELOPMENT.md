# 开发文档

> 梦境星云档案馆 - 统一开发文档
> 最后更新：2026-03-29

---

## 📋 目录

1. [快速开始](#快速开始)
2. [环境配置](#环境配置)
3. [开发规范](#开发规范)
4. [问题排查](#问题排查)
5. [开发日志](#开发日志)

---

## 快速开始

### 检查清单

```bash
# 1. 检查 Docker
docker ps | grep yashandb

# 2. 检查 YashanDB（如未运行则启动）
docker start yashandb

# 3. 启动后端
cd backend
python main.py

# 4. 启动前端
cd .
npm run dev
```

### 服务地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 API | http://localhost:8000 |
| API 文档 | http://localhost:8000/docs |
| YashanDB | localhost:1688 |

---

## 环境配置

### YashanDB 连接信息

| 配置项 | 值 |
|--------|-----|
| 主机 | localhost |
| 端口 | 1688 |
| 用户 | system |
| 密码 | Cod-2022 |

### 环境变量

```bash
# backend/.env
YASDB_HOST=localhost
YASDB_PORT=1688
YASDB_USER=system
YASDB_PASSWORD=Cod-2022
DEEPSEEK_API_KEY=your_key_here

# 前端 .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
```

---

## 开发规范

### 项目结构

```
dream-nebula-archive/
├── app/                    # Next.js App Router
├── backend/                # FastAPI 后端
│   ├── api/               # API 路由
│   ├── database/          # YashanDB 连接池
│   └── services/          # 业务逻辑
├── components/            # React 组件
├── lib/                   # 工具库
└── docs/                  # 文档
```

### 代码规范

**Python 后端**：
- 使用连接池：`pool.acquire()` / `pool.release()`
- 所有数据库操作使用参数绑定
- 事务使用 try/except/finally

**前端**：
- 使用 TypeScript
- 组件命名使用 kebab-case
- API 调用统一使用 `lib/api-client.ts`

---

## 问题排查

### 常见问题

**Q: YashanDB 连接超时**
A: 等待 30 秒让数据库完全初始化

**Q: 前端无法访问后端 API**
A: 检查 `NEXT_PUBLIC_DEMO_MODE=false`

**Q: yaspy 导入失败**
A: 使用 `/yashandb-python` 技能安装

**Q: 端口被占用**
A: 后端改用 8001 端口

---

## 开发日志

### 2026-03-29 - 参赛准备

- ✅ 修复连接池使用（所有 API 改用连接池）
- ✅ 创建提示词文档
- ✅ 创建演示稿
- ✅ 创建性能测试报告

### 2026-03-26 - 前后端联调

- ✅ 解决 CORS 跨域问题
- ✅ 修复 API 响应格式不匹配
- ✅ Next.js 代理配置优化

### 2026-03-25 - UI 优化

- ✅ 翻页功能（每页6个梦境）
- ✅ 统计仪表板页面
- ✅ 分享和导出功能
- ✅ 星云骨架屏加载动画

### 2026-03-24 - UI 重设计

- ✅ v0.dev 玻璃态设计风格
- ✅ 程序化星云背景
- ✅ 梦境详情页修复

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 15.5 | 前端框架 |
| FastAPI | - | 后端框架 |
| YashanDB | 23.4 | 数据库 |
| yaspy | - | Python 驱动 |
| DeepSeek API | - | AI 服务 |

---

**维护**: 本文档整合了原有的 DEVELOPMENT.md、DEVLOG.md、PROGRESS.md 等文件
