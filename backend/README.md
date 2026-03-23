# 梦境星云档案馆 - 后端

Dream Nebula Archive Backend - 基于 YashanDB 的沉浸式梦境记录与分析平台

## 技术栈

- **框架**: FastAPI 0.104+
- **数据库**: YashanDB (Python 驱动: yaspy)
- **AI 服务**: DeepSeek API
- **Python**: 3.9+

## 目录结构

```
backend/
├── main.py                 # 应用入口
├── requirements.txt        # Python 依赖
├── .env.example            # 环境变量模板
├── database/
│   ├── connection.py       # YashanDB 连接池
│   ├── models.py           # Pydantic 数据模型
│   └── migrations.sql      # 数据库建表脚本
├── api/
│   ├── dreams.py           # 梦境 CRUD API
│   ├── analysis.py         # AI 分析 API
│   └── search.py           # 搜索统计 API
└── services/
    ├── ai_service.py       # AI 服务集成
    ├── nebula_generator.py # 程序化星云生成
    └── emotion_stats.py    # 情感统计分析
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 安装 YashanDB Python 驱动

```bash
# 使用 Claude Code 技能安装
/yashandb-python
```

或者手动安装：
1. 先安装 C 驱动：`/yashandb-c`
2. 从官网下载 Python 驱动：https://download.yashandb.com
3. 安装：`pip install yaspy-xxx.whl`

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库和 API 密钥
```

### 4. 初始化数据库

```bash
# 确保 YashanDB Docker 容器正在运行
docker ps | grep yashandb

# 执行建表脚本
docker exec -it yashandb yasql sys/Cod-2022 @ database/migrations.sql
```

### 5. 启动服务

```bash
# 开发模式
python main.py

# 或使用 uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API 文档

服务启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 核心 API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/dreams` | POST | 创建梦境 |
| `/api/dreams` | GET | 获取梦境列表 |
| `/api/dreams/:id` | GET | 获取梦境详情 |
| `/api/dreams/:id/analyze` | POST | 触发 AI 分析 |
| `/api/users/:id/profile` | GET | 获取用户画像 |
| `/api/dreams/search` | GET | 搜索梦境 |

## YashanDB 亮点

1. **Python 驱动**: 使用 `yaspy` 连接 YashanDB
2. **连接池**: 高性能连接池管理 (min=2, max=10)
3. **事务处理**: 完整的 ACID 事务支持
4. **序列**: 使用 SEQUENCE 实现自增主键
5. **JSON 存储**: CLOB 字段存储 JSON 格式数据

## 参赛说明

本项目是为 **YashanDB AI 应用挑战赛** 开发，主要展示：
- YashanDB Python 驱动集成
- 复杂数据查询与分析
- 事务处理与连接池管理
- AI 服务集成（DeepSeek）

## 开发进度

- [x] 项目结构搭建
- [x] 数据库表设计
- [x] 连接池配置
- [ ] 梦境 CRUD API
- [ ] AI 分析集成
- [ ] 搜索统计功能
- [ ] 程序化星云生成

## 许可证

MIT License
