# -*- coding: utf-8 -*-
"""
赛博周公 - AI 梦境解读服务
提供心理学风格的梦境分析和"心灵天气预报"
"""
import os
import asyncio
import httpx
from typing import Dict, List, Optional
from pydantic import BaseModel

# DeepSeek API 配置
# 使用梦境解读专用的 API Key
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_INTERPRETATION_API_KEY") or os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")

# 心理象征符号库
SYMBOLS_LIBRARY = {
    "水": {"meaning": "潜意识与情感的流动", "mood": "平静"},
    "火": {"meaning": "激情、愤怒或转化", "mood": "兴奋"},
    "飞行": {"meaning": "渴望自由或超越现状", "mood": "愉悦"},
    "坠落": {"meaning": "失去控制或安全感缺失", "mood": "焦虑"},
    "追逐": {"meaning": "逃避问题或追求目标", "mood": "焦虑"},
    "镜子": {"meaning": "自我反思或内省", "mood": "平静"},
    "门": {"meaning": "新的机会或选择", "mood": "平静"},
    "森林": {"meaning": "探索未知或迷失", "mood": "忧郁"},
    "海": {"meaning": "情感深度与生命起源", "mood": "平静"},
    "山": {"meaning": "目标达成或人生挑战", "mood": "平静"},
    "雨": {"meaning": "情感净化或悲伤释放", "mood": "悲伤"},
    "太阳": {"meaning": "希望、新生或觉醒", "mood": "愉悦"},
    "月亮": {"meaning": "直觉、女性能量或潜意识", "mood": "平静"},
    "星星": {"meaning": "指引方向或愿望", "mood": "平静"},
    "云": {"meaning": "情感变化或思绪飘忽", "mood": "平静"},
    "蛇": {"meaning": "转化、智慧或恐惧", "mood": "焦虑"},
    "鸟": {"meaning": "精神自由或消息", "mood": "愉悦"},
    "花": {"meaning": "成长、美丽或短暂", "mood": "愉悦"},
    "树": {"meaning": "生命力、成长或根基", "mood": "平静"},
    "路": {"meaning": "人生旅程或选择", "mood": "平静"},
}


class InterpretationResult(BaseModel):
    """解读结果"""
    summary: str  # 梦境概要
    symbols: List[Dict[str, str]]  # 发现的象征符号
    psychological_meaning: str  # 心理学含义
    subconscious_message: str  # 潜意识信息
    life_guidance: str  # 生活指引
    mental_weather: Dict[str, str]  # 心灵天气预报


class DreamInterpreter:
    """梦境解读器 - 赛博周公"""

    def __init__(self):
        self.client = None

    async def _get_client(self):
        """获取 HTTP 客户端"""
        if self.client is None:
            self.client = httpx.AsyncClient(
                base_url=DEEPSEEK_BASE_URL,
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=30.0
            )
        return self.client

    def _extract_symbols(self, dream_content: str) -> List[Dict[str, str]]:
        """从梦境内容中提取象征符号"""
        found_symbols = []

        for symbol, info in SYMBOLS_LIBRARY.items():
            if symbol in dream_content:
                found_symbols.append({
                    "symbol": symbol,
                    "meaning": info["meaning"],
                    "mood": info["mood"]
                })

        # 如果没找到，返回通用符号
        if not found_symbols:
            found_symbols.append({
                "symbol": "未知",
                "meaning": "等待解析的神秘符号",
                "mood": "平静"
            })

        return found_symbols

    def _generate_mental_weather(self, emotion_type: str, symbols: List[Dict]) -> Dict[str, str]:
        """生成心灵天气预报"""
        weather_map = {
            "平静": {"forecast": "晴朗", "temp": "24°C", "advice": "内心平静，适合深度思考"},
            "愉悦": {"forecast": "多云转晴", "temp": "26°C", "advice": "情绪高涨，创造力充沛"},
            "忧郁": {"forecast": "小雨", "temp": "18°C", "advice": "需要情感疏导，建议独处"},
            "悲伤": {"forecast": "阵雨", "temp": "16°C", "advice": "允许情感释放，寻求支持"},
            "恐惧": {"forecast": "雷暴", "temp": "22°C", "advice": "直面恐惧，寻找安全感"},
            "兴奋": {"forecast": "晴间多云", "temp": "28°C", "advice": "精力旺盛，注意休息"},
            "焦虑": {"forecast": "阴天", "temp": "20°C", "advice": "压力较大，需要放松"},
        }

        base_weather = weather_map.get(emotion_type, weather_map["平静"])

        # 根据符号调整天气
        symbol_moods = [s["mood"] for s in symbols]
        if "焦虑" in symbol_moods:
            base_weather["forecast"] = "局部阴天"
            base_weather["advice"] = "有些不安，关注内心感受"

        return base_weather

    def _fallback_interpretation(
        self,
        dream_content: str,
        emotion_type: str,
        symbols: List[Dict]
    ) -> InterpretationResult:
        """基于规则的兜底解读"""
        # 提取关键意象
        key_images = []
        for symbol in symbols[:3]:
            key_images.append(symbol["symbol"])

        # 生成概要
        summary = f"这个梦境呈现了{', '.join(key_images)}等意象，整体氛围{emotion_type}。"

        # 心理学含义
        psychological_meaning = f"""
        从心理学角度看，这个梦境反映了你当前的潜意识状态。
        梦中的{', '.join(key_images)}可能代表你内心深处的某种渴望或担忧。
        {emotion_type}的情感基调表明你正在处理相关的情绪体验。
        """

        # 潜意识信息
        subconscious_message = f"""
        你的潜意识正在通过这些符号与你沟通：
        {symbols[0]['symbol'] if symbols else '梦境'} 提醒你关注 {symbols[0]['meaning'] if symbols else '内心感受'}。
        这可能与你的日常生活或近期经历有关。
        """

        # 生活指引
        guidance_map = {
            "平静": "保持这种平和的状态，适合做重要决策",
            "愉悦": "把握当下的积极情绪，将其转化为行动力",
            "忧郁": "允许自己感受情绪，但不要被其淹没",
            "悲伤": "给自己时间疗愈，寻求亲友的支持",
            "恐惧": "识别恐惧的来源，小步面对它",
            "兴奋": "利用这股能量，但要避免冲动决策",
            "焦虑": "停下来深呼吸，将大问题分解成小步骤",
        }
        life_guidance = guidance_map.get(emotion_type, "保持觉察，关注内心声音")

        # 心灵天气
        mental_weather = self._generate_mental_weather(emotion_type, symbols)

        return InterpretationResult(
            summary=summary.strip(),
            symbols=symbols,
            psychological_meaning=psychological_meaning.strip(),
            subconscious_message=subconscious_message.strip(),
            life_guidance=life_guidance,
            mental_weather=mental_weather
        )

    async def interpret(
        self,
        dream_content: str,
        emotion_type: str,
        emotion_score: float
    ) -> InterpretationResult:
        """
        解读梦境

        Args:
            dream_content: 梦境内容
            emotion_type: 情感类型
            emotion_score: 情感强度

        Returns:
            InterpretationResult: 解读结果
        """
        # 提取象征符号
        symbols = self._extract_symbols(dream_content)

        # 如果没有 API Key，使用兜底方案
        if not DEEPSEEK_API_KEY or DEEPSEEK_API_KEY == "your_api_key_here":
            return self._fallback_interpretation(dream_content, emotion_type, symbols)

        # 使用 DeepSeek 进行 AI 解读
        try:
            client = await self._get_client()

            symbols_desc = "\n".join([
                f"- {s['symbol']}: {s['meaning']}"
                for s in symbols[:5]
            ])

            prompt = f"""你是一位精通荣格心理学和弗洛伊德精神分析学的梦境分析师（赛博周公）。请用诗意、深刻且富有洞察力的方式解读以下梦境。

---

## 🌙 梦境内容
{dream_content}

## 💫 情感状态
**主导情感**: {emotion_type}
**情感强度**: {emotion_score:.2f} / 1.0

## 🔮 发现的象征符号
{symbols_desc}

---

## 解读要求

请从心理学和潜意识角度，为这个梦境提供以下五个方面的分析：

### 1️⃣ summary（梦境概要）
用一句话（30-50字）诗意地概括这个梦境的核心内容和氛围。

### 2️⃣ psychological_meaning（心理学含义）
从荣格心理学角度分析这个梦境的深层含义（120-150字）：
- 梦中的意象象征着什么？
- 这些意象如何反映做梦者的内心世界？
- 梦境在表达什么样的心理需求或冲突？

### 3️⃣ subconscious_message（潜意识信息）
解读潜意识想要通过这个梦境传达的信息（100-120字）：
- 潜意识在提醒做梦者注意什么？
- 有哪些被压抑的情感或想法需要被看见？
- 这个梦境与做梦者的现实生活有什么关联？

### 4️⃣ life_guidance（生活指引）
基于梦境分析，给出对现实生活的具体建议（60-80字）：
- 做梦者应该如何将这些洞察应用到日常生活中？
- 有什么具体的行动建议？

---

## 输出格式

请严格按照以下 JSON 格式返回：

```json
{{
    "summary": "梦境概要（30-50字）",
    "psychological_meaning": "心理学含义分析（120-150字）",
    "subconscious_message": "潜意识信息解读（100-120字）",
    "life_guidance": "生活指引建议（60-80字）"
}}
```

## 风格要求
- 语言优美、富有诗意，同时保持专业性和洞察力
- 避免陈词滥调，提供独特的解读视角
- 兼顾科学性和可读性，让普通人也能理解
- 使用温暖、关怀的语气，像一位睿智的心理咨询师

**只返回JSON格式，不要包含任何其他文字或标记。**
"""

            response = await client.post(
                "/chat/completions",
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "你是一位荣格心理学派梦境分析师，擅长用诗意的语言解读梦境的深层含义。"
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.8,
                    "max_tokens": 1000
                }
            )

            if response.status_code == 200:
                result = response.json()
                content = result["choices"][0]["message"]["content"]

                # 尝试解析 JSON
                import json
                try:
                    # 提取 JSON 部分
                    if "```json" in content:
                        content = content.split("```json")[1].split("```")[0].strip()
                    elif "```" in content:
                        content = content.split("```")[1].split("```")[0].strip()

                    ai_result = json.loads(content)

                    # 生成心灵天气预报
                    mental_weather = self._generate_mental_weather(emotion_type, symbols)

                    return InterpretationResult(
                        summary=ai_result.get("summary", "这是一个充满象征意义的梦境"),
                        symbols=symbols,
                        psychological_meaning=ai_result.get("psychological_meaning", ""),
                        subconscious_message=ai_result.get("subconscious_message", ""),
                        life_guidance=ai_result.get("life_guidance", ""),
                        mental_weather=mental_weather
                    )
                except (json.JSONDecodeError, KeyError):
                    # JSON 解析失败，使用兜底方案
                    pass

            # API 调用失败，使用兜底方案
            return self._fallback_interpretation(dream_content, emotion_type, symbols)

        except Exception as e:
            print(f"[WARN] AI interpretation failed: {e}")
            return self._fallback_interpretation(dream_content, emotion_type, symbols)

    async def close(self):
        """关闭客户端"""
        if self.client:
            await self.client.aclose()


# 全局实例
dream_interpreter = DreamInterpreter()


def interpret_dream_sync(
    dream_content: str,
    emotion_type: str,
    emotion_score: float
) -> Dict:
    """同步包装函数"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    result = loop.run_until_complete(
        dream_interpreter.interpret(dream_content, emotion_type, emotion_score)
    )

    return result.dict()
