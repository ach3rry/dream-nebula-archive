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
        # 使用情感分析专用的 API Key
        self.api_key = os.getenv("DEEPSEEK_EMOTION_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
        self.base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
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
        return f"""你是一位专业的梦境分析师，擅长通过梦境内容分析做梦者的情感状态。请仔细阅读以下梦境内容，并准确分析其中的情感基调。

## 梦境内容
{dream_content}

## 分析要求
请从以下7种情感类型中选择最符合梦境基调的一种：
1. **平静** - 宁静、安详、平和的心境
2. **愉悦** - 开心、快乐、积极的情绪
3. **兴奋** - 激动、期待、充满活力的状态
4. **焦虑** - 担心、紧张、不安的情绪
5. **恐惧** - 害怕、惊恐、威胁感的体验
6. **忧郁** - 惆怅、感伤、思念的情绪
7. **悲伤** - 难过、痛苦、失落的心情

## 输出格式
请严格按照以下 JSON 格式返回分析结果：
```json
{{
    "emotion": "情感类型（必须是上述7种之一）",
    "intensity": 情感强度0.1-1.0之间的数值,
    "keywords": ["关键词1", "关键词2", "关键词3", "关键词4"],
    "summary": "用一句话总结这个梦境的核心内容（30-50字）"
}}
```

## 注意事项
- emotion字段必须严格使用上述7种情感类型之一
- intensity数值应根据梦境中情感表达的强烈程度来确定
- keywords应提取梦境中最重要的意象、动作、场景等关键词（3-5个）
- summary应简洁准确，突出梦境的核心内容和情感基调

只返回JSON，不要包含任何其他文字。
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
        # 增强的关键词匹配逻辑
        keywords = []
        emotion = "平静"
        score = 0.3
        emotion_scores = {}  # 记录每种情感的出现次数

        # 情感关键词匹配（使用中文）- 扩展关键词库
        emotion_keywords = {
            "恐惧": {
                "direct": ["害怕", "恐惧", "惊恐", "吓", "恐怖", "惊慌", "颤抖", "冷汗"],
                "actions": ["追逐", "逃跑", "躲藏", "被追", "怪物", "鬼", "恶魔", "攻击", "威胁"],
                "atmosphere": ["黑暗", "深渊", "悬崖", "坠落", "陷阱", "噩梦", "可怕", "诡异"]
            },
            "愉悦": {
                "direct": ["开心", "快乐", "笑", "幸福", "庆祝", "欢乐", "愉快", "欣喜"],
                "actions": ["拥抱", "亲吻", "跳舞", "歌唱", "欢笑", "享受", "赞美"],
                "atmosphere": ["阳光", "温暖", "明亮", "美丽", "鲜花", "彩虹", "礼物", "惊喜"]
            },
            "悲伤": {
                "direct": ["哭", "难过", "悲伤", "痛苦", "伤心", "哀悼", "流泪", "哭泣"],
                "actions": ["离别", "分离", "失去", "告别", "死亡", "葬礼", "离去", "消失"],
                "atmosphere": ["孤独", "凄凉", "灰暗", "阴雨", "冷清", "荒凉", "破碎", "凋零"]
            },
            "焦虑": {
                "direct": ["焦虑", "担心", "紧张", "压力", "着急", "不安", "烦躁", "慌张"],
                "actions": ["等待", "寻找", "迷路", "错过", "来不及", "赶", "催", "急"],
                "atmosphere": ["拥挤", "嘈杂", "混乱", "压抑", "闷", "紧迫", "危机", "警报"]
            },
            "兴奋": {
                "direct": ["兴奋", "激动", "期待", "惊喜", "热血", "澎湃", "振奋", "雀跃"],
                "actions": ["飞翔", "奔跑", "跳跃", "攀登", "探索", "发现", "冒险", "冲刺"],
                "atmosphere": ["灿烂", "辉煌", "壮观", "震撼", "激情", "活力", "爆发", "闪耀"]
            },
            "忧郁": {
                "direct": ["忧郁", "惆怅", "思念", "怀念", "感伤", "哀愁", "惋惜", "遗憾"],
                "actions": ["回忆", "想起", "怀念", "回望", "追溯", "追忆", "缅怀", "眷恋"],
                "atmosphere": ["黄昏", "夕阳", "暮色", "秋叶", "落花", "残垣", "旧物", "褪色"]
            }
        }

        # 计算每种情感的得分
        for emotion_type, keyword_groups in emotion_keywords.items():
            emotion_count = 0
            for group in keyword_groups.values():
                for word in group:
                    if word in dream_content:
                        emotion_count += 1
                        # 同时收集关键词
                        if len(word) >= 2 and word not in keywords:
                            keywords.append(word)
            if emotion_count > 0:
                emotion_scores[emotion_type] = emotion_count

        # 选择得分最高的情感
        if emotion_scores:
            emotion = max(emotion_scores, key=emotion_scores.get)
            score = min(0.3 + emotion_scores[emotion] * 0.1, 0.9)  # 根据关键词数量动态计算分数

        # 扩展的关键词提取
        extended_keywords = [
            # 自然元素
            "星星", "月亮", "太阳", "云", "雨", "雪", "风", "雾",
            "水", "火", "山", "海", "河", "湖", "森林", "田野",
            # 人物与动物
            "家人", "朋友", "陌生人", "动物", "鸟", "鱼", "狗", "猫",
            # 动作
            "飞行", "坠落", "追逐", "逃跑", "寻找", "发现", "攀登", "潜水",
            # 场景
            "房子", "房间", "门", "窗", "桥", "路", "车", "船",
            # 物品
            "镜子", "时钟", "书", "花", "树", "石头", "宝石", "钥匙",
            # 抽象概念
            "时间", "记忆", "梦", "光", "影", "声音", "颜色", "温度"
        ]

        for kw in extended_keywords:
            if kw in dream_content and kw not in keywords:
                keywords.append(kw)

        return {
            "emotion_type": emotion,
            "emotion_score": score,
            "confidence": 0.6 if emotion_scores else 0.4,
            "keywords": keywords[:8],  # 增加关键词数量
            "summary": dream_content[:50] + "..." if len(dream_content) > 50 else dream_content
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
