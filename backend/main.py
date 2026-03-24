"""
梦境星云档案馆 - FastAPI 主入口
Dream Nebula Archive - Main Application Entry

参赛项目：YashanDB AI 应用挑战赛
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    logger.info("🚀 梦境星云档案馆启动中...")
    logger.info("📡 正在连接 YashanDB 数据库...")
    # TODO: 初始化 YashanDB 连接池
    yield
    # 关闭时执行
    logger.info("👋 梦境星云档案馆关闭中...")


# 创建 FastAPI 应用
app = FastAPI(
    title="梦境星云档案馆 API",
    description="Dream Nebula Archive - YashanDB AI Application Challenge",
    version="1.0.0",
    lifespan=lifespan
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vue3 开发服务器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 健康检查
@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "service": "Dream Nebula Archive API",
        "database": "YashanDB",
        "version": "1.0.0"
    }


# 根路径
@app.get("/")
async def root():
    """根路径欢迎信息"""
    return {
        "message": "欢迎来到梦境星云档案馆 🌌",
        "description": "Dream Nebula Archive - 沉浸式梦境记录与分析平台",
        "features": [
            "3D 梦境星云可视化",
            "AI 情感分析与解梦",
            "程序化星云图生成",
            "YashanDB 数据存储"
        ],
        "docs": "/docs",
        "github": "https://github.com/ach3rry/dream-nebula-archive"
    }


# 路由注册
from api import dreams, interpretation

app.include_router(dreams.router)
app.include_router(interpretation.router)
# TODO: 添加其他路由
# from api import analysis, search
# app.include_router(analysis.router, prefix="/api/analysis", tags=["AI 分析"])
# app.include_router(search.router, prefix="/api/search", tags=["搜索统计"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
