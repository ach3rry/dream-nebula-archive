"""
插入高质量诗意梦境到 YashanDB
"""
import requests
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_URL = "http://localhost:8000/api/dreams"
USER_ID = 1

# 高质量诗意梦境 - 参考v0.dev风格
poetic_dreams = [
    {
        "content": "雨停后的屋檐下，我数着滴落的水珠，每一滴都落进昨天未完成的诗句里。"
    },
    {
        "content": "我在无人的深夜奔跑，脚下的柏油路逐渐变成了柔软的云层，两旁的路灯是北斗星洒落的碎屑。"
    },
    {
        "content": "旧书店的角落里，一本泛黄的书在低语，翻开的每一页都飘出樱花瓣，落在我的手背上化作月光。"
    },
    {
        "content": "地铁穿过城市的地底，隧道壁上浮现出深海的水母，它们透明的触须里藏着我要对你说却没说出口的话。"
    },
    {
        "content": "屋顶的风车停了，我爬上去修理，发现齿轮间卡着一片羽毛——那是记忆中的白鹭留下的。"
    },
    {
        "content": "清晨的露珠里倒映着另一个世界，我伸手触碰，指尖穿过水面，打湿了那个世界的黄昏。"
    },
    {
        "content": "电梯没有停在一楼，而是继续下行，穿过楼层来到云端的花园，那里种着所有我忘记种下的花。"
    },
    {
        "content": "我在镜子前梳头，镜子里的人停下了动作，她的眼神温柔而悲伤，像是替我保管着什么重要的东西。"
    }
]

def insert_dreams():
    """插入诗意梦境"""
    print("插入高质量诗意梦境到 YashanDB...")
    print("=" * 60)

    for i, dream in enumerate(poetic_dreams, 1):
        try:
            response = requests.post(
                API_URL,
                json={
                    "user_id": USER_ID,
                    "content": dream["content"],
                    "is_private": False
                },
                timeout=15
            )

            if response.status_code == 200:
                data = response.json()
                emotion = data.get('emotion', {}).get('type', 'N/A')
                print(f"{i}. ✅ 插入成功 (ID: {data['id']}) | 情感: {emotion}")
                print(f"   内容: {dream['content'][:35]}...")
            else:
                print(f"{i}. ❌ 插入失败: {response.status_code}")

        except Exception as e:
            print(f"{i}. ❌ 插入异常: {e}")

    print("=" * 60)
    print("✨ 完成！梦境星云档案馆已更新。")

if __name__ == "__main__":
    insert_dreams()
