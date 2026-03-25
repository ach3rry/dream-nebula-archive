# 🌌 梦境星云档案馆

## Dream Nebula Archive

> 基于 YashanDB 的沉浸式梦境记录与分析平台
>
> **YashanDB AI 应用挑战赛** 参赛作品

---

## 项目概述

梦境星云档案馆是一个创新的梦境记录与分析应用，将用户的梦境转化为可视化的星云图。每一颗星星代表一个梦境，通过 AI 情感分析和心理学视角的解梦报告，帮助用户理解自己的潜意识世界。

### 核心特性

| 特性 | 描述 |
|------|------|
| 🌟 **3D 梦境星云** | Canvas 渲染的动态星空，每颗星星代表一个梦境 |
| 🎨 **程序化星云** | 根据情感生成独特的星云背景图 |
| 🤖 **AI 情感分析** | DeepSeek AI 驱动的情感分类和解梦报告 |
| 💾 **YashanDB 存储** | 使用 YashanDB 存储梦境数据，展示连接池和事务处理 |
| 📄 **PDF/图片导出** | 生成精美的梦境分析报告 |
| 🌊 **沉浸式交互** | 果冻质感 UI、动画渐变、创新交互体验 |
| 🚀 **静态 Demo** | 无需后端即可体验的演示版本 |

---

## 技术架构

```
┌─────────────────────────────────────────────┐
│              前端层 (Next.js)                │
│  React + TailwindCSS + Turbopack            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            后端层 (FastAPI)                  │
│  Python + yaspy 驱动 + DeepSeek API         │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          数据层 (YashanDB)                   │
│  连接池 + 事务 + 序列 + JSON 存储           │
└─────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | Next.js 15.5 + React 19 | 现代化全栈框架 |
| **样式** | TailwindCSS 4 | 快速构建梦幻风格 |
| **3D 渲染** | Canvas API | 动态星空效果 |
| **后端** | FastAPI | Python 异步框架 |
| **数据库** | YashanDB | 参赛核心要求 |
| **AI 服务** | DeepSeek API | 情感分析 + 解梦 |

---

## 快速开始

### 前置要求

- Python 3.9+
- Node.js 18+
- YashanDB (本地或 Docker)

### 方式一：运行静态 Demo（推荐用于体验）

```bash
# 安装依赖
npm install

# 启动 Demo 模式（无需后端）
npm run dev:demo

# 访问 http://localhost:3000
```

Demo 模式使用预置的 mock 数据，无需配置后端和数据库即可体验完整功能。

### 方式二：完整版（需要 YashanDB + DeepSeek API）

#### 1. 配置环境变量

```bash
# 前端
cp .env.example .env.local
# 确保 NEXT_PUBLIC_DEMO_MODE=false

# 后端
cd backend
cp .env.example .env
# 配置 DeepSeek API 密钥
```

#### 2. 启动 YashanDB

```bash
docker run -d \
  -p 1688:1688 \
  -v ~/yashan/data:/data/yashan \
  -v ~/yashan/yasboot:/home/yashan/.yasboot \
  -e SYS_PASSWD=Cod-2022 \
  --name yashandb \
  docker.1ms.run/yasdb/yashandb:23.4.7.100
```

#### 3. 安装 YashanDB Python 驱动

```bash
# 安装 C 驱动
# 下载: https://download.yashandb.com
# 或使用 yashandb-c 技能

# 安装 Python 驱动
pip install yaspy-xx.xx.whl
```

#### 4. 启动后端

```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### 5. 启动前端

```bash
npm run dev
```

#### 6. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000/docs

---

## 部署到 Vercel

Demo 版本可以一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ach3rry/dream-nebula-archive&env=NEXT_PUBLIC_DEMO_MODE=true)

部署后设置环境变量：
- `NEXT_PUBLIC_DEMO_MODE=true`

---

## YashanDB 应用亮点

### 1. Python 驱动集成

```python
import yaspy

pool = yaspy.SessionPool(
    user="system",
    password="Cod-2022",
    dsn="localhost:1688",
    min=2,
    max=10
)
```

### 2. 连接池管理

- 最小连接数: 2
- 最大连接数: 10
- 连接复用，提升性能

### 3. 事务处理

```python
try:
    # 插入梦境记录
    # 批量插入标签
    # 更新用户档案
    conn.commit()
except Exception as e:
    conn.rollback()
```

### 4. JSON 数据存储

使用 CLOB 字段存储 JSON 格式的关键词、情感分布等数据。

### 5. 序列使用

```sql
CREATE SEQUENCE seq_dream_records START WITH 1 INCREMENT BY 1;
```

---

## 项目结构

```
dream-nebula-archive/
├── app/                        # Next.js App Router
│   ├── page.tsx               # 首页
│   ├── layout.tsx             # 布局
│   ├── dreams/
│   │   └── [id]/
│   │       └── page.tsx       # 梦境详情页
│   └── api/                   # API 路由代理
│
├── components/                 # React 组件
│   ├── dream-recorder.tsx     # 梦境记录
│   ├── dream-feed.tsx         # 梦境列表
│   ├── dream-card.tsx         # 梦境卡片
│   ├── dream-detail-view.tsx  # 梦境详情
│   ├── dream-interpretation.tsx # AI 解梦
│   ├── dream-export.tsx       # PDF/图片导出
│   ├── starfield.tsx          # 星空背景
│   └── navbar.tsx             # 导航栏
│
├── lib/                        # 工具库
│   ├── api-client.ts          # API 客户端（支持 Demo 模式）
│   └── mock-data.ts           # Mock 数据
│
├── backend/                    # FastAPI 后端
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   ├── connection.py       # YashanDB 连接池
│   │   └── migrations.sql      # 建表脚本
│   ├── api/                    # API 路由
│   └── services/               # 业务逻辑
│
├── .env.demo                   # Demo 模式配置
├── .env.local                  # 本地环境变量
└── package.json
```

---

## 功能演示

### 1. 捕梦台

- 碎片化输入梦境内容
- 实时 AI 情感分析
- 美观的输入界面

### 2. 梦境档案

- 卡片式梦境列表
- 情感标签分类
- 快速浏览和筛选

### 3. 梦境详情

- 完整的梦境内容展示
- 关键词标签
- 编辑和删除功能

### 4. 赛博周公解梦

- DeepSeek AI 情感分析
- 心理学风格解梦报告
- 心灵天气预报
- 象征符号解读

### 5. 报告导出

- PDF 格式报告
- 高清图片导出
- 包含完整梦境和分析

---

## Demo 模式说明

Demo 模式特点：
- ✅ 无需后端和数据库
- ✅ 8 个预置梦境样本
- ✅ 完整的 AI 分析模拟
- ✅ 所有交互功能可用
- ✅ 可直接部署到 Vercel

切换模式：
```bash
# Demo 模式
NEXT_PUBLIC_DEMO_MODE=true npm run dev

# 完整模式
NEXT_PUBLIC_DEMO_MODE=false npm run dev
```

---

## 参赛信息

- **赛事**: YashanDB AI 应用挑战赛
- **赛程**: 2026年3月23日 - 4月20日
- **作者**: [@ach3rry](https://github.com/ach3rry)
- **技术支持**: YashanDB + DeepSeek API

---

## 许可证

MIT License

---

**让每一颗梦想都成为星空中独特的星辰 ✨**
