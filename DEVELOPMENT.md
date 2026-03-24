# 梦境星云档案馆 - 开发规范

> **版本**: v1.1.0
> **最后更新**: 2026-03-24 13:40
> **目的**: 确保 session 连续性开发的规范管理
> **重要**: 后端服务使用端口 **8001**（8000有僵尸进程占用）

---

## 📋 项目概述

| 属性 | 值 |
|------|-----|
| **项目名称** | 梦境星云档案馆 (Dream Nebula Archive) |
| **参赛赛事** | YashanDB AI 应用挑战赛 |
| **赛程** | 2026-03-23 ~ 2026-04-20 |
| **GitHub** | https://github.com/ach3rry/dream-nebula-archive |
| **本地路径** | D:/projects/dream-nebula-archive |

---

## 🗂️ 目录结构规范

```
dream-nebula-archive/
├── backend/                    # FastAPI 后端
│   ├── main.py                # 主入口 (路由注册)
│   ├── requirements.txt       # 依赖列表
│   ├── .env                   # 环境变量 (不提交)
│   ├── .env.example           # 环境变量模板
│   ├── database/
│   │   ├── connection.py      # YashanDB 连接池
│   │   ├── models.py          # Pydantic 数据模型
│   │   └── migrations.sql     # 建表脚本
│   ├── api/                   # API 路由
│   │   ├── dreams.py          # 梦境 CRUD ✅
│   │   ├── analysis.py        # AI 分析 ⏳
│   │   └── search.py          # 搜索统计 ⏳
│   └── services/              # 业务逻辑
│       ├── emotion_analyzer.py
│       ├── dream_interpreter.py
│       └── keyword_extractor.py
│
├── frontend/                   # Vue3 前端
│   ├── src/
│   │   ├── views/             # 页面组件
│   │   │   ├── Capture.vue       # 捕梦台 ⏳
│   │   │   ├── DreamDetail.vue   # 梦境详情 ⏳
│   │   │   └── Archive.vue       # 档案馆 ⏳
│   │   ├── components/        # 公共组件
│   │   ├── threejs/           # Three.js 模块
│   │   │   └── StarField.vue  # 星空粒子 ✅
│   │   ├── api/               # API 调用
│   │   │   ├── client.js      # Axios 配置 ✅
│   │   │   └── dreams.js      # 梦境 API ✅
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Pinia 状态管理
│   │   └── utils/             # 工具函数
│   ├── tailwind.config.js     # TailwindCSS 配置 ✅
│   └── package.json
│
├── docs/                       # 文档
│   ├── DEVELOPMENT.md         # 本文件 - 开发规范
│   ├── PROGRESS.md            # 开发进度日志
│   └── TROUBLESHOOTING.md     # 问题排查指南 ⏳
│
└── README.md
```

---

## 🔑 环境配置规范

### YashanDB 连接信息

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **主机** | localhost | Docker 容器端口映射 |
| **端口** | 1688 | YashanDB 默认端口 |
| **用户** | system | 管理员用户 |
| **密码** | Cod-2022 | 环境变量 SYS_PASSWD 设置 |
| **数据库名** | yashandb | 默认数据库 |

### 环境变量 (.env)

```bash
# YashanDB 连接配置
YASDB_HOST=localhost
YASDB_PORT=1688
YASDB_USER=dream_user
YASDB_PASSWORD=Dream1234

# DeepSeek AI 配置
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# 服务端口
BACKEND_PORT=8001  # ⚠️ 注意：8000端口被占用
FRONTEND_PORT=5173

# 环境
ENVIRONMENT=development
DEBUG=true
```

---

## 🚀 启动流程规范

### 每次开发前检查清单

```bash
# 1. 检查 Docker Desktop
docker --version
docker ps

# 2. 检查 YashanDB 容器
docker ps | grep yashandb
# 如未运行: docker start yashandb

# 3. 等待数据库启动（重要！）
# 容器启动后需要等待约 30 秒完成初始化

# 4. 测试数据库连接
python -c "import yaspy; conn = yaspy.connect(user='system', password='Cod-2022', dsn='localhost:1688'); print('OK')"

# 5. 启动后端
cd D:/projects/dream-nebula-archive/backend
python main.py

# 6. 启动前端（新终端）
cd D:/projects/dream-nebula-archive/frontend
npm run dev
```

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端** | http://localhost:5174 | Vue3 开发服务器 ⚠️ 注意端口变化 |
| **后端 API** | http://localhost:8001 | FastAPI 服务 ⚠️ 注意端口 |
| **API 文档** | http://localhost:8001/docs | Swagger UI |
| **数据库** | localhost:1688 | YashanDB |

---

## ⚠️ 已知问题与解决方案

### 问题 1: 端口 8000 被占用

**错误**: `ERROR: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)`

**原因**: 多个僵尸 Python 进程占用端口 8000，无法被正常 kill

**解决方案**:
```bash
# 方案1: 使用端口 8001（推荐）
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001

# 方案2: 重启机器清理僵尸进程（临时方案）
```

**相关 PIDs**: 33332, 39380, 39792, 44584, 43108, 46696

---

### 问题 2: YashanDB 密码认证失败

**错误**: `YAS-02143 invalid username/password, login denied`

**原因**: 容器刚启动，数据库未完全初始化

**解决方案**:
```bash
# 等待 30 秒让数据库完全启动
sleep 30

# 然后测试连接
python -c "import yaspy; ..."
```

### 问题 2: 连接超时

**错误**: `YAS-00413 wait for receive timeout`

**原因**: 数据库还在初始化中

**解决方案**: 等待更长时间（最多 60 秒）

### 问题 3: yaspy 导入失败

**错误**: `ModuleNotFoundError: No module named 'yaspy'`

**解决方案**:
```bash
# yaspy 已从源码安装在此位置
cd D:/projects/yashandb-python
pip install -e .
```

### 问题 4: FastAPI async 与 yaspy 同步驱动不兼容 ⚠️

**错误**: Internal Server Error，无详细日志

**原因**: yaspy 是同步驱动，与 FastAPI 的 `async def` 路由处理不兼容

**解决方案**: 移除所有 `async def`，改用普通 `def`

**代码示例**:
```python
# ❌ 错误写法
@router.post("")
async def create_dream(dream: DreamCreate):
    conn = yaspy.connect(...)  # 同步驱动在 async 上下文中报错

# ✅ 正确写法（当前实现）
@router.post("", response_model=DreamResponse)
def create_dream(dream: DreamCreate):  # 注意：没有 async
    from database.connection import get_config
    import yaspy

    config = get_config()
    conn = yaspy.connect(
        user=config.user,
        password=config.password,
        dsn=config.dsn
    )

    try:
        cursor = conn.cursor()
        # 数据库操作
        conn.commit()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
```

**参考**:
- [FastAPI 并发文档](https://fastapi.tiangolo.com/zh/async/)
- 使用同步驱动时必须使用普通 `def`

---

### 问题 5: 前端样式未加载

**错误**: TailwindCSS 样式不生效

**解决方案**:
- 确认使用 TailwindCSS v3.4.19
- 确认 postcss.config.cjs 存在
- 确认 src/tailwind.css 被导入

---

## 📝 代码规范

### Python 后端

```python
# API 路由结构
from fastapi import APIRouter, Depends
from database.models import BaseModel
from database.connection import get_connection

router = APIRouter(prefix="/api/xxx", tags=["功能名称"])

@router.post("", response_model=ResponseModel)
async def create_xxx(request: RequestModel, conn=Depends(get_connection)):
    """功能描述"""
    try:
        cursor = conn.cursor()
        # 数据库操作
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
```

### Vue3 前端

```vue
<!-- 组件结构 -->
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/api/client'

// 响应式数据
const data = ref(null)

// 生命周期
onMounted(async () => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 使用 TailwindCSS 类名 */
</style>
```

---

## 🔄 Session 连续性检查

每次新 session 开始时，先执行：

```bash
# 1. 确认项目目录
cd D:/projects/dream-nebula-archive

# 2. 查看进度文件
cat docs/PROGRESS.md
cat docs/DEVELOPMENT.md

# 3. 检查服务状态
docker ps | grep yashandb

# 4. 确认依赖安装
pip list | grep -E "(fastapi|yaspy|pydantic)"
npm list --prefix frontend

# 5. 查看当前 TODO
grep -r "TODO\|FIXME\|⏳" backend/ frontend/src/
```

---

## 📊 开发进度追踪

当前状态：**阶段 1 - 基础设施搭建**

- [x] Docker Desktop 安装
- [x] YashanDB 容器部署
- [x] YashanDB C 驱动安装
- [x] YashanDB Python 驱动 (yaspy) 编译安装
- [x] 数据库表结构创建
- [x] FastAPI 后端框架
- [x] 梦境 CRUD API
- [x] Vue3 前端框架
- [x] Three.js 星空粒子系统
- [x] TailwindCSS 样式配置
- [x] API 客户端配置

下一步：**阶段 2 - 前端页面开发**

---

## 🛠️ 技术栈版本

| 技术 | 版本 | 说明 |
|------|------|------|
| Python | 3.13.11 | 后端语言 |
| Node.js | 18+ | 前端构建 |
| FastAPI | 0.135.2 | 后端框架 |
| Vue | 3.x | 前端框架 |
| TailwindCSS | 3.4.19 | 样式框架 |
| Three.js | latest | 3D 渲染 |
| YashanDB | 23.4.7.100 | 数据库 |
| yaspy | 1.0.1 | Python 驱动 |

---

**文档维护**: 每次重大变更后更新此文档
