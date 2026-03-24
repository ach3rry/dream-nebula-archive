"""
插入示例梦境数据到 YashanDB
"""
import requests
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_URL = "http://localhost:8001/api/dreams"
USER_ID = 1

sample_dreams = [
    {
        "content": "我发现自己漂浮在一片无边无际的紫色星云中，周围是闪烁的星辰。每当我伸出手去触碰一颗星星，它就会变成一只发光的蝴蝶飞向远方。我感觉非常自由，仿佛能听到宇宙的心跳声。"
    },
    {
        "content": "在梦中我潜入了一片幽蓝的深海，发现了一座由透明水晶建造的宫殿。宫殿里的每个房间都播放着不同的记忆，像是全息投影一般。水母般的光点在周围漂浮，一切都那么宁静美好。"
    },
    {
        "content": "我登上了一列穿梭于不同时代的银色列车。每一节车厢都通向不同的历史时期，我在古罗马、未来都市和恐龙时代之间自由穿行。窗外的风景快速变幻，像是一部快进的电影。"
    },
    {
        "content": "一个由无数镜子组成的迷宫，但每面镜子中的我都有着不同的表情和姿态。有些镜中人在微笑，有些在哭泣，有些甚至在说着我听不懂的语言。当我试图靠近时，他们却全部转过头去。"
    },
    {
        "content": "我回到了已经被拆除多年的童年老屋，一切都和记忆中一模一样。奶奶在厨房做饭的香味飘来，窗外是永远停留在夏天的阳光。我想开口说话，却发现自己发不出声音。"
    },
    {
        "content": "夜空中的星座突然活了过来，猎户座开始和我讲述他千年来目睹的故事，北斗七星指引我找到了一颗属于我的未命名星球。那颗星星发出温暖的光芒，仿佛在等我回家。"
    }
]

def insert_dreams():
    """插入示例梦境"""
    for i, dream in enumerate(sample_dreams, 1):
        try:
            response = requests.post(
                API_URL,
                json={
                    "user_id": USER_ID,
                    "content": dream["content"],
                    "is_private": False  # 公开示例数据
                },
                timeout=10
            )

            if response.status_code == 201:
                data = response.json()
                print(f"✅ 梦境 {i} 插入成功 (ID: {data['id']})")
            else:
                print(f"❌ 梦境 {i} 插入失败: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"❌ 梦境 {i} 插入异常: {e}")

if __name__ == "__main__":
    print("🌌 开始插入示例梦境到 YashanDB...")
    print("=" * 50)
    insert_dreams()
    print("=" * 50)
    print("✨ 完成！")
