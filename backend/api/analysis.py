"""
AI 分析 API 路由
提供梦境情感分析、关键词提取、星云生成等功能
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List
from pydantic import BaseModel, Field

from services.emotion_analyzer import analyze_dream_emotion
from services.keyword_extractor import extract_keywords, generate_tags
from services.nebula_generator import generate_nebula_params, generate_star_positions

router = APIRouter(prefix="/api/analysis", tags=["AI 分析"])


# ===== 请求/响应模型 =====

class EmotionAnalysisRequest(BaseModel):
    """情感分析请求"""
    dream_content: str = Field(..., min_length=1, max_length=10000, description="梦境内容")


class EmotionAnalysisResponse(BaseModel):
    """情感分析响应"""
    emotion_type: str = Field(..., description="情感类型")
    emotion_label: str = Field(..., description="情感标签（中文）")
    emotion_score: float = Field(..., ge=-1, le=1, description="情感强度")
    confidence: float = Field(..., ge=0, le=1, description="置信度")
    keywords: List[str] = Field(default_factory=list, description="关键词列表")
    summary: str = Field(..., description="梦境摘要")


class KeywordExtractionResponse(BaseModel):
    """关键词提取响应"""
    elements: List[Dict] = Field(default_factory=list, description="梦境元素")
    symbols: List[Dict] = Field(default_factory=list, description="梦境符号")
    emotions: List[str] = Field(default_factory=list, description="情绪词")
    entities: List[str] = Field(default_factory=list, description="实体")
    tags: List[str] = Field(default_factory=list, description="标签")


class NebulaGenerationRequest(BaseModel):
    """星云生成请求"""
    dream_content: str = Field(..., description="梦境内容")
    emotion: str = Field(default="CALM", description="主导情感")
    dream_id: int = Field(default=1, description="梦境 ID（用于生成星星位置）")


class NebulaGenerationResponse(BaseModel):
    """星云生成响应"""
    seed: int = Field(..., description="随机种子")
    emotion: str = Field(..., description="情感类型")
    colors: Dict[str, str] = Field(..., description="配色方案")
    particles: Dict = Field(..., description="粒子参数")
    clouds: List[Dict] = Field(..., description="星云层")
    effects: Dict = Field(..., description="特效参数")
    stars: List[Dict] = Field(default_factory=list, description="星星位置")


# ===== API 端点 =====

@router.post("/emotion", response_model=EmotionAnalysisResponse, summary="分析梦境情感")
async def analyze_emotion(request: EmotionAnalysisRequest):
    """
    使用 AI 分析梦境的情感

    - 分析梦境的主导情感
    - 计算情感强度
    - 提取关键词
    - 生成简短摘要
    """
    try:
        result = await analyze_dream_emotion(request.dream_content)

        # 情感类型映射回中文
        emotion_labels = {
            "CALM": "平静",
            "SAD": "悲伤",
            "FEAR": "恐惧",
            "EXCITED": "兴奋",
            "ANXIOUS": "焦虑",
            "MELANCHOLY": "忧郁",
            "JOYFUL": "愉悦"
        }

        return EmotionAnalysisResponse(
            emotion_type=result["emotion_type"],
            emotion_label=emotion_labels.get(result["emotion_type"], "平静"),
            emotion_score=result["emotion_score"],
            confidence=result["confidence"],
            keywords=result["keywords"],
            summary=result["summary"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"情感分析失败: {str(e)}"
        )


@router.post("/keywords", response_model=KeywordExtractionResponse, summary="提取梦境关键词")
def extract_dream_keywords(request: EmotionAnalysisRequest):
    """
    从梦境中提取关键词和标签

    - 识别梦境元素（自然、人物、动物等）
    - 解析梦境符号
    - 提取情绪词
    - 生成标签
    """
    try:
        keywords = extract_keywords(request.dream_content)
        tags = generate_tags(request.dream_content)

        return KeywordExtractionResponse(
            elements=keywords["elements"],
            symbols=keywords["symbols"],
            emotions=keywords["emotions"],
            entities=keywords["entities"][:10],
            tags=tags
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"关键词提取失败: {str(e)}"
        )


@router.post("/nebula", response_model=NebulaGenerationResponse, summary="生成星云参数")
def generate_nebula(request: NebulaGenerationRequest):
    """
    根据梦境生成星云视觉效果参数

    - 基于情感生成配色方案
    - 根据内容生成粒子系统
    - 生成星云层
    - 生成星星位置
    - 配置特效参数
    """
    try:
        # 生成星云参数
        nebula = generate_nebula_params(
            request.dream_content,
            request.emotion
        )

        # 生成星星位置
        stars = generate_star_positions(request.dream_id, count=150)

        return NebulaGenerationResponse(
            seed=nebula["seed"],
            emotion=nebula["emotion"],
            colors=nebula["colors"],
            particles=nebula["particles"],
            clouds=nebula["clouds"],
            effects=nebula["effects"],
            stars=stars
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"星云生成失败: {str(e)}"
        )


@router.get("/health", summary="AI 分析服务健康检查")
def health_check():
    """检查 AI 分析服务状态"""
    import os

    return {
        "status": "healthy",
        "service": "AI Analysis API",
        "features": {
            "emotion_analysis": True,
            "keyword_extraction": True,
            "nebula_generation": True
        },
        "deepseek_configured": bool(os.getenv("DEEPSEEK_API_KEY"))
    }
