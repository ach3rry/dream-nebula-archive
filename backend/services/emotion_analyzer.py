"""
AI 情感分析服务
使用 DeepSeek API 分析梦境内容的情感
"""
import os
import httpx
from typing import Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()


class EmotionAnalyzer:
    """梦境情感分析器"""

    # 情感类型映射
    EMOTION_TYPES = {
        "平静": "CALM",
        "悲伤": "SAD",
        "恐惧": "FEAR",
        "兴奋": "EXCITED",
        "焦虑": "ANXIOUS",
        "忧郁": "MELANCHOLY",
        "愉悦": "JOYFUL"
    }

    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.base_url = "https://api.deepseek.com/v1"
        self.model = "deepseek-chat"

    async def analyze(self, dream_content: str) -> Dict:
        """
        分析梦境内容的情感

        Args:
            dream_content: 梦境文本内容

        Returns:
            包含情感分析结果的字典：
            {
                "emotion_type": "CALM",
                "emotion_score": 0.5,
                "confidence": 0.85,
                "keywords": ["星星", "飞行"],
                "summary": "简短的梦境摘要"
            }
        """
        if not self.api_key:
            # 如果没有配置 API Key，返回默认值
            return self._default_analysis(dream_content)

        try:
            prompt = self._build_prompt(dream_content)

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "你是一位专业的梦境分析师，擅长心理学解梦和情感分析。"
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 500
                    }
                )
                response.raise_for_status()
                result = response.json()

            return self._parse_response(result["choices"][0]["message"]["content"])

        except Exception as e:
            print(f"AI 分析失败: {e}")
            return self._default_analysis(dream_content)

    def _build_prompt(self, dream_content: str) -> str:
        """构建 AI 提示词"""
        return f"""
请分析以下梦境内容，返回 JSON 格式的分析结果：

梦境内容：
{dream_content}

请返回以下格式的 JSON：
{{
    "emotion": "平静/悲伤/恐惧/兴奋/焦虑/忧郁/愉悦",
    "intensity": 0.0-1.0 之间的情感强度,
    "keywords": ["关键词1", "关键词2", "关键词3"],
    "summary": "一句话总结这个梦境（不超过50字）"
}}

只返回 JSON，不要有其他内容。
"""

    def _parse_response(self, response_text: str) -> Dict:
        """解析 AI 响应"""
        import json
        import re

        # 尝试提取 JSON
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())

                emotion_cn = data.get("emotion", "平静")
                # 直接返回中文情感类型
                emotion_type = emotion_cn if emotion_cn in ["平静", "悲伤", "恐惧", "兴奋", "焦虑", "忧郁", "愉悦"] else "平静"

                return {
                    "emotion_type": emotion_type,
                    "emotion_score": data.get("intensity", 0.5),
                    "confidence": 0.85,
                    "keywords": data.get("keywords", []),
                    "summary": data.get("summary", "")
                }
            except json.JSONDecodeError:
                pass

        return self._default_analysis("")

    def _default_analysis(self, dream_content: str) -> Dict:
        """默认分析（当 AI 不可用时）"""
        # 简单的关键词匹配
        keywords = []
        emotion = "平静"
        score = 0.3

        # 情感关键词匹配（使用中文）
        emotion_keywords = {
            "恐惧": ["害怕", "恐惧", "追逐", "逃跑", "怪物"],
            "愉悦": ["开心", "快乐", "笑", "幸福", "庆祝"],
            "悲伤": ["哭", "难过", "悲伤", "失落", "分离"],
            "焦虑": ["焦虑", "担心", "紧张", "压力", "着急"],
            "兴奋": ["兴奋", "激动", "期待", "惊喜"],
            "忧郁": ["忧郁", "惆怅", "思念", "怀念"]
        }

        for emotion_type, words in emotion_keywords.items():
            if any(word in dream_content for word in words):
                emotion = emotion_type
                score = 0.6
                break

        # 提取可能的关键词
        possible_keywords = ["星星", "月亮", "飞行", "坠落", "水", "火", "家人", "朋友", "追逐", "逃跑"]
        keywords = [kw for kw in possible_keywords if kw in dream_content]

        return {
            "emotion_type": emotion,
            "emotion_score": score,
            "confidence": 0.5,
            "keywords": keywords[:5],
            "summary": dream_content[:30] + "..." if len(dream_content) > 30 else dream_content
        }


# 全局实例
emotion_analyzer = EmotionAnalyzer()


def analyze_dream_emotion_sync(dream_content: str) -> Dict:
    """
    分析梦境情感的同步函数

    Args:
        dream_content: 梦境文本

    Returns:
        情感分析结果字典
    """
    import asyncio

    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    return loop.run_until_complete(emotion_analyzer.analyze(dream_content))


async def analyze_dream_emotion(dream_content: str) -> Dict:
    """
    分析梦境情感的便捷函数

    Args:
        dream_content: 梦境文本

    Returns:
        情感分析结果字典
    """
    return await emotion_analyzer.analyze(dream_content)
