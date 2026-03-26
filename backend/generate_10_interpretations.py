# -*- coding: utf-8 -*-
"""
为前10条梦境生成 DeepSeek 解读
"""
import os
import sys
import asyncio
import json
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

# 手动加载 .env 文件
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()

from services.dream_interpreter import dream_interpreter

# 前10条梦境数据
dreams_data = [
    {"id": 1, "content": "雨停后的屋檐下，我数着滴落的水珠，每一滴都落进昨天未完成的诗句里。", "emotion": "平静", "score": 0.6},
    {"id": 2, "content": "我在无人的深夜奔跑，脚下的柏油路逐渐变成了柔软的云层，两旁的路灯是北斗星洒落的碎屑。", "emotion": "平静", "score": 0.7},
    {"id": 3, "content": "旧书店的角落里，一本泛黄的书在低语，翻开的每一页都飘出樱花瓣，落在我的手背上化作月光。", "emotion": "平静", "score": 0.3},
    {"id": 4, "content": "地铁穿过城市的地底，隧道壁上浮现出深海的水母，它们透明的触须里藏着我要对你说却没说出口的话。", "emotion": "忧郁", "score": 0.7},
    {"id": 5, "content": "屋顶的风车停了，我爬上去修理，发现齿轮间卡着一片羽毛——那是记忆中的白鹭留下的。", "emotion": "忧郁", "score": 0.6},
    {"id": 6, "content": "清晨的露珠里倒映着另一个世界，我伸手触碰，指尖穿过水面，打湿了那个世界的黄昏。", "emotion": "忧郁", "score": 0.6},
    {"id": 7, "content": "电梯没有停在一楼，而是继续下行，穿过楼层来到云端的花园，那里种着所有我忘记种下的花。", "emotion": "忧郁", "score": 0.6},
    {"id": 8, "content": "我在镜子前梳头，镜子里的人停下了动作，她的眼神温柔而悲伤，像是替我保管着什么重要的东西。", "emotion": "忧郁", "score": 0.7},
    {"id": 9, "content": "一朵云在我掌心绽放，里面住着所有我未能说出口的告别。它们化作雨滴落下，每一滴都打湿了一个人的模样。", "emotion": "忧郁", "score": 0.8},
    {"id": 10, "content": "我站在时间的十字路口，看到无数个自己在不同选择中走向不同的未来。有的成为画家，有的成为流浪者，有的在等我做出选择。我们隔着透明的玻璃墙，却互不相识。", "emotion": "焦虑", "score": 0.8},
]

async def generate_interpretations():
    """为前10条梦境生成解读"""
    results = {}

    print("Starting to generate interpretations for first 10 dreams...\n")

    for i, dream in enumerate(dreams_data, 1):
        print(f"[{i}/10] Generating interpretation for dream {dream['id']}...")
        print(f"  Content: {dream['content'][:40]}...")

        try:
            result = await dream_interpreter.interpret(
                dream_content=dream["content"],
                emotion_type=dream["emotion"],
                emotion_score=dream["score"]
            )

            results[dream["id"]] = {
                "summary": result.summary,
                "symbols": result.symbols,
                "psychological_meaning": result.psychological_meaning,
                "subconscious_message": result.subconscious_message,
                "life_guidance": result.life_guidance,
                "mental_weather": result.mental_weather
            }

            print(f"  [OK] Summary: {result.summary[:40]}...\n")

            # 添加延迟
            await asyncio.sleep(1)

        except Exception as e:
            print(f"  [FAIL] Error: {e}\n")
            import traceback
            traceback.print_exc()
            results[dream["id"]] = None

    # 保存到文件
    output_file = Path(__file__).parent / "interpretations_10.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n[COMPLETE] Saved to: {output_file}")
    print(f"[STATS] Success: {sum(1 for v in results.values() if v is not None)}/10")

    return results

if __name__ == "__main__":
    asyncio.run(generate_interpretations())
