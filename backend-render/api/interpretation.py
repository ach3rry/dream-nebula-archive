# -*- coding: utf-8 -*-
"""
梦境解读 API 路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/interpretation", tags=["interpretation"])


class InterpretationRequest(BaseModel):
    """解读请求"""
    dream_content: str
    emotion_type: str
    emotion_score: float


class InterpretationResponse(BaseModel):
    """解读响应"""
    summary: str
    symbols: list
    psychological_meaning: str
    subconscious_message: str
    life_guidance: str
    mental_weather: dict


@router.post("/analyze", response_model=InterpretationResponse, summary="解读梦境")
def analyze_dream(request: InterpretationRequest):
    """
    解读梦境 - 赛博周公

    使用 AI 分析梦境内容，提供心理学风格的解读报告
    """
    try:
        from services.dream_interpreter import interpret_dream_sync

        result = interpret_dream_sync(
            dream_content=request.dream_content,
            emotion_type=request.emotion_type,
            emotion_score=request.emotion_score
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"解读失败: {str(e)}")
