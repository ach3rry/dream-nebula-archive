"""
数据库模型定义
Pydantic 模型用于 API 请求和响应验证
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# 枚举类型
class EmotionType(str, Enum):
    """情感类型枚举"""
    CALM = "平静"      # 蓝紫色
    SAD = "悲伤"       # 灰蓝色
    FEAR = "恐惧"      # 暗红色
    EXCITED = "兴奋"    # 金黄色
    ANXIOUS = "焦虑"    # 红色
    MELANCHOLY = "忧郁" # 深紫色
    JOYFUL = "愉悦"    # 亮绿色


# ===== 请求模型 =====

class DreamCreate(BaseModel):
    """创建梦境请求模型"""
    user_id: int = Field(..., description="用户 ID")
    content: str = Field(..., min_length=1, max_length=10000, description="梦境内容")
    is_private: bool = Field(True, description="是否私密")


class DreamUpdate(BaseModel):
    """更新梦境请求模型"""
    content: Optional[str] = Field(None, min_length=1, max_length=10000)
    is_private: Optional[bool] = None


class AnalysisRequest(BaseModel):
    """AI 分析请求模型"""
    dream_id: int = Field(..., description="梦境 ID")


# ===== 响应模型 =====

class EmotionAnalysis(BaseModel):
    """情感分析结果"""
    type: EmotionType = Field(..., description="主要情感类型")
    score: float = Field(..., ge=-1, le=1, description="情感强度 -1~1")
    confidence: float = Field(..., ge=0, le=1, description="置信度 0~1")


class DreamTag(BaseModel):
    """梦境标签"""
    id: int
    tag_name: str
    tag_category: str  # 元素/场景/情绪


class DreamResponse(BaseModel):
    """梦境响应模型"""
    id: int
    user_id: int
    content: str
    title: Optional[str] = None
    emotion: Optional[EmotionAnalysis] = None
    keywords: List[str] = []
    dream_image_url: Optional[str] = None
    interpretation: Optional[str] = None
    tags: List[DreamTag] = []
    is_private: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DreamListResponse(BaseModel):
    """梦境列表响应"""
    total: int
    dreams: List[DreamResponse]
    page: int
    page_size: int


class UserProfile(BaseModel):
    """用户心理档案"""
    id: int
    user_id: int
    total_dreams: int
    dominant_emotion: Optional[str] = None
    psychological_summary: Optional[str] = None
    weather_forecast: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class EmotionStats(BaseModel):
    """情感统计"""
    total_dreams: int
    emotion_distribution: dict[str, int]
    avg_emotion_score: float
    recent_trend: List[dict]


class TagCloud(BaseModel):
    """词云数据"""
    tag: str
    count: int
    category: str


class SearchFilters(BaseModel):
    """搜索过滤器"""
    keyword: Optional[str] = None
    emotion: Optional[EmotionType] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    user_id: int
