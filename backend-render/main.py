"""
梦境星云档案馆 - Render演示版后端
Dream Nebula Archive - Render Demo Backend

提供AI分析功能，无需YashanDB
用于演示完整的工作流程
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os

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
    logger.info("🚀 梦境星云档案馆 (Render版) 启动中...")
    logger.info("🤖 AI分析服务已就绪")
    yield
    # 关闭时执行
    logger.info("👋 梦境星云档案馆关闭中...")


# 创建 FastAPI 应用
app = FastAPI(
    title="梦境星云档案馆 API (演示版)",
    description="Dream Nebula Archive - AI Analysis Demo",
    version="1.0.0-demo",
    lifespan=lifespan
)

# 配置 CORS - 允许所有来源（用于演示）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 演示版允许所有来源
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
        "service": "Dream Nebula Archive API (Demo)",
        "version": "1.0.0-demo",
        "features": {
            "emotion_analysis": True,
            "keyword_extraction": True,
            "nebula_generation": True,
            "dream_interpretation": True
        },
        "deepseek_configured": bool(os.getenv("DEEPSEEK_API_KEY"))
    }


# 根路径
@app.get("/")
async def root():
    """根路径欢迎信息"""
    return {
        "message": "欢迎来到梦境星云档案馆 (演示版) 🌌",
        "description": "Dream Nebula Archive - AI Analysis Demo Backend",
        "features": [
            "AI 情感分析",
            "关键词提取",
            "星云参数生成",
            "梦境解读 (赛博周公)"
        ],
        "docs": "/docs",
        "github": "https://github.com/ach3rry/dream-nebula-archive",
        "note": "这是演示版后端，提供AI分析功能。完整版需要YashanDB数据库。"
    }


# 路由注册
from api import analysis, interpretation

app.include_router(analysis.router)
app.include_router(interpretation.router)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
