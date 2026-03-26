# -*- coding: utf-8 -*-
"""
为所有梦境生成 DeepSeek 解读
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

# 32条梦境数据
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
    {"id": 11, "content": "我发现自己在一座倒置的城市里行走，天空是铺满鹅卵石的街道，云朵是从地底升起的古老建筑。人们倒挂着行走，他们的笑声从上方传来，像是从另一个维度的问候。", "emotion": "平静", "score": 0.8},
    {"id": 12, "content": "钢琴的琴键自动弹奏，每一个音符都化作一朵莲花，从琴键上升起。房间里渐渐开满了花，花香浓郁到让我忘记自己是否还在醒着的世界。", "emotion": "平静", "score": 0.8},
    {"id": 13, "content": "我站在悬崖边，看着自己变成一只白鹭飞向天空。风托举着我，我看见地面上的房屋变成了火柴盒，城市变成了一张地图，而我终于飞到了地图边缘之外。", "emotion": "平静", "score": 0.8},
    {"id": 14, "content": "我站在雨中行走，每一滴雨珠都映照出一张脸——那些我曾在生命中遇见又匆匆告别的人。我张开手接住一滴，它在我手心里化作了泪水。", "emotion": "忧郁", "score": 0.8},
    {"id": 15, "content": "钟楼的钟声敲响第十三下，时间开始重叠。我看见早晨的自己与黄昏的自己擦肩而过，我们互不相识，却在同一个路口等红绿灯。", "emotion": "忧郁", "score": 0.7},
    {"id": 16, "content": "我潜入一口深井，井底不是水而是一片星空。我在星空中游泳，每一颗星都是一个记忆，我游过它们，像游过自己的一生。", "emotion": "平静", "score": 0.3},
    {"id": 17, "content": "风筝带我飞上云端，我低头看见地面的田野变成了一张巨大的乐谱。农民们是音符，他们在田垄间移动，演奏着大地无声的歌。", "emotion": "平静", "score": 0.8},
    {"id": 18, "content": "废弃的游乐园里，旋转木马开始转动，但上面坐的都是我童年的玩偶。它们看着我，眼神里满是责问——为什么把我一个人留在这里？", "emotion": "忧郁", "score": 0.8},
    {"id": 19, "content": "暴风雨中的灯塔，光束在黑暗中划出孤寂的轨迹。我站在灯塔顶端，看着海浪中无数张熟悉的面孔浮现又消失，他们都是我曾经遗忘的人。", "emotion": "忧郁", "score": 0.8},
    {"id": 20, "content": "图书馆的书架无限向上延伸，我抓住一本书的边缘，整个人被吸进了书页里。文字变成了蝴蝶，围绕着我飞舞，每一个字都是一句未说出口的话。", "emotion": "忧郁", "score": 0.6},
    {"id": 21, "content": "地铁在无限的隧道中穿行，每一站都是一个季节。我看见春天的樱花在车厢里绽放，冬天的雪花从座位下升起，而我只是匆匆过客，无法在任何一个季节停留。", "emotion": "忧郁", "score": 0.7},
    {"id": 22, "content": "旧照片里的人开始活动，他们笑着招手让我进去。我跨过相框的边界，发现自己站在童年的院子里，那棵桂花树还在，只是开出的花是蓝色的。", "emotion": "忧郁", "score": 0.6},
    {"id": 23, "content": "城市突然开始生长，建筑像藤蔓一样向天空攀爬。我站在楼顶，看着脚下的街道变成了森林，路灯变成了萤火虫，整个城市都在呼吸。", "emotion": "平静", "score": 0.7},
    {"id": 24, "content": "夜空中的星座突然活了过来，猎户座开始和我讲述他千年来目睹的故事，北斗七星指引我找到了一颗属于我的未命名星球。那颗星星发出温暖的光芒，仿佛在等我回家。", "emotion": "平静", "score": 0.8},
    {"id": 25, "content": "我回到了已经被拆除多年的童年老屋，一切都和记忆中一模一样。奶奶在厨房做饭的香味飘来，窗外是永远停留在夏天的阳光。我想开口说话，却发现自己发不出声音。", "emotion": "忧郁", "score": 0.7},
    {"id": 26, "content": "一个由无数镜子组成的迷宫，但每面镜子中的我都有着不同的表情和姿态。有些镜中人在微笑，有些在哭泣，有些甚至在说着我听不懂的语言。当我试图靠近时，他们却全部转过头去。", "emotion": "焦虑", "score": 0.8},
    {"id": 27, "content": "我登上了一列穿梭于不同时代的银色列车。每一节车厢都通向不同的历史时期，我在古罗马、未来都市和恐龙时代之间自由穿行。窗外的风景快速变幻，像是一部快进的电影。", "emotion": "兴奋", "score": 0.8},
    {"id": 28, "content": "在梦中我潜入了一片幽蓝的深海，发现了一座由透明水晶建造的宫殿。宫殿里的每个房间都播放着不同的记忆，像是全息投影一般。水母般的光点在周围漂浮，一切都那么宁静美好。", "emotion": "平静", "score": 0.8},
    {"id": 29, "content": "我发现自己漂浮在一片无边无际的紫色星云中，周围是闪烁的星辰。每当我伸出手去触碰一颗星星，它就会变成一只发光的蝴蝶飞向远方。我感觉非常自由，仿佛能听到宇宙的心跳声。", "emotion": "平静", "score": 0.8},
    {"id": 30, "content": "我走进一座没有出口的图书馆，每一本书都是我遗忘的一段记忆。当我翻开一本，书页化作飞鸟四散，它们飞向高窗，把我的过去带向光明的彼岸。", "emotion": "平静", "score": 0.8},
    {"id": 31, "content": "月光把我的影子剪成碎片，每一片都独立行走，在城市的角落里经历不同的人生。等到黎明，它们重新拼凑，却多了一些我未曾体验过的记忆。", "emotion": "平静", "score": 0.8},
    {"id": 32, "content": "巨大的鲸鱼游过城市上空，它的身体是透明的，里面装满了星光。当它张嘴歌唱时，整座城市的人都停下了脚步，抬头看着星尘如雨般落下。", "emotion": "平静", "score": 0.8},
]

async def generate_all_interpretations():
    """为所有梦境生成解读"""
    results = {}

    print("Starting to generate interpretations for 32 dreams...\n")

    for i, dream in enumerate(dreams_data, 1):
        print(f"[{i}/32] Generating interpretation for dream {dream['id']}...")
        print(f"  Content: {dream['content'][:30]}...")

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

            print(f"  [OK] Done! Summary: {result.summary[:30]}...\n")

            # 添加延迟避免 API 限流
            await asyncio.sleep(2)

        except Exception as e:
            print(f"  [FAIL] Error: {e}\n")
            # 使用默认解读
            results[dream["id"]] = None

    # 保存到文件
    output_file = Path(__file__).parent / "generated_interpretations.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n[COMPLETE] Interpretations saved to: {output_file}")
    print(f"[STATS] Successfully generated: {sum(1 for v in results.values() if v is not None)}/32")

    return results

if __name__ == "__main__":
    # 检查 API Key
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key or api_key == "sk-xxx":
        print("[WARNING] DEEPSEEK_API_KEY not set or is default value")
        print("Please set a valid DeepSeek API Key:")
        print("  export DEEPSEEK_API_KEY=your_actual_api_key")
        print("Or set it in .env file")
        sys.exit(1)

    # 运行生成
    asyncio.run(generate_all_interpretations())
