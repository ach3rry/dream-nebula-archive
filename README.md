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
| 🌟 **3D 梦境星云** | Three.js 渲染的 1500+ 粒子星空，每颗星星代表一个梦境 |
| 🎨 **程序化星云** | 根据情感和关键词生成独特的星云背景图 |
| 🤖 **AI 情感分析** | DeepSeek AI 驱动的情感分类和解梦报告 |
| 💾 **YashanDB 存储** | 使用 YashanDB 存储梦境数据，展示连接池和事务处理 |
| 🌊 **沉浸式交互** | 粒子坍缩、穿越动画、烟雾效果等创新交互 |

---

## 技术架构

```
┌─────────────────────────────────────────────┐
│              前端层 (Vue3)                   │
│  Three.js + TailwindCSS + Vite              │
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
| **前端** | Vue 3 + Vite | 现代化前端框架 |
| **3D 渲染** | Three.js | 粒子星空效果 |
| **样式** | TailwindCSS | 快速构建梦幻风格 |
| **后端** | FastAPI | Python 异步框架 |
| **数据库** | YashanDB | 参赛核心要求 |
| **AI 服务** | DeepSeek API | 情感分析 + 解梦 |
| **部署** | Docker Compose | 一键启动 |

---

## 项目结构

```
dream-nebula-archive/
├── backend/                    # FastAPI 后端
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   ├── connection.py       # YashanDB 连接池
│   │   ├── models.py           # Pydantic 模型
│   │   └── migrations.sql      # 建表脚本
│   ├── api/                    # API 路由
│   └── services/               # 业务逻辑
│
├── frontend/                   # Vue3 前端
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   ├── components/         # 公共组件
│   │   ├── threejs/            # Three.js 模块
│   │   └── api/                # API 调用
│   └── package.json
│
├── docker/
│   └── docker-compose.yml      # 一键启动
│
└── docs/                       # 文档
```

---

## 快速开始

### 前置要求

- Python 3.9+
- Node.js 18+
- Docker Desktop
- DeepSeek API Key

### 1. 克隆项目

```bash
git clone https://github.com/ach3rry/dream-nebula-archive.git
cd dream-nebula-archive
```

### 2. 启动 YashanDB

```bash
docker run -d \
  -p 1688:1688 \
  -v ~/yashan/data:/data/yashan \
  -v ~/yashan/yasboot:/home/yashan/.yasboot \
  -e SYS_PASSWD=Cod-2022 \
  --name yashandb \
  docker.1ms.run/yasdb/yashandb:23.4.7.100
```

### 3. 安装 YashanDB Python 驱动

```bash
# 使用 Claude Code 技能
/yashandb-python
```

### 4. 启动后端

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # 配置 API 密钥
python main.py
```

### 5. 启动前端

```bash
cd frontend
npm install
npm run dev
```

### 6. 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:8000/docs

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

## 功能演示

### 1. 捕梦台

- 碎片化输入梦境内容
- 实时粒子反馈效果
- 量子坍缩"大爆炸"动画

### 2. 梦境星云

- 1500+ 动态粒子星空
- 情感聚类星云团
- 鼠标悬停显示关键词

### 3. 记忆潜入

- 镜头推进穿越效果
- 程序化星云背景
- AI 解梦烟雾浮现

### 4. 赛博周公

- DeepSeek AI 情感分析
- 心理学风格解梦报告
- 心理天气预报

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
