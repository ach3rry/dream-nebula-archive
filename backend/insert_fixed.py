# -*- coding: utf-8 -*-
"""
插入更多高质量诗意梦境到数据库
"""
import requests
import sys
import io

# 设置输出编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_URL = "http://localhost:8000/api/dreams"
USER_ID = 1

# 更多高质量诗意梦境
more_poetic_dreams = [
    {
        "content": "时钟的指针开始倒转，我看着咖啡杯里的涟漪向外扩散，变成了一个个同心圆的台阶。我沿着台阶走上去，每一步都踩在昨天的时间里。",
        "expected_emotion": "平静"
    },
    {
        "content": "巨大的鲸鱼游过城市上空，它的身体是透明的，里面装满了星光。当它张嘴歌唱时，整座城市的人都停下了脚步，抬头看着星尘如雨般落下。",
        "expected_emotion": "愉悦"
    },
    {
        "content": "我在镜子里看见另一个自己，她穿着我从未见过的白色长裙，眼神里满是悲伤。她伸出手，指尖穿过镜面，在我脸颊上留下一滴冰凉的水珠。",
        "expected_emotion": "忧郁"
    },
    {
        "content": "图书馆的书架无限向上延伸，我抓住一本书的边缘，整个人被吸进了书页里。文字变成了蝴蝶，围绕着我飞舞，每一个字都是一句未说出口的话。",
        "expected_emotion": "兴奋"
    },
    {
        "content": "暴风雨中的灯塔，光束在黑暗中划出孤寂的轨迹。我站在灯塔顶端，看着海浪中无数张熟悉的面孔浮现又消失，他们都是我曾经遗忘的人。",
        "expected_emotion": "悲伤"
    },
    {
        "content": "地铁在无限的隧道中穿行，每一站都是一个季节。我看见春天的樱花在车厢里绽放，冬天的雪花从座位下升起，而我只是匆匆过客，无法在任何一个季节停留。",
        "expected_emotion": "焦虑"
    },
    {
        "content": "钢琴的琴键自动弹奏，每一个音符都化作一朵莲花，从琴键上升起。房间里渐渐开满了花，花香浓郁到让我忘记自己是否还在醒着的世界。",
        "expected_emotion": "平静"
    },
    {
        "content": "我站在悬崖边，看着自己变成一只白鹭飞向天空。风托举着我，我看见地面上的房屋变成了火柴盒，城市变成了一张地图，而我终于飞到了地图边缘之外。",
        "expected_emotion": "愉悦"
    },
    {
        "content": "旧照片里的人开始活动，他们笑着招手让我进去。我跨过相框的边界，发现自己站在童年的院子里，那棵桂花树还在，只是开出的花是蓝色的。",
        "expected_emotion": "忧郁"
    },
    {
        "content": "城市突然开始生长，建筑像藤蔓一样向天空攀爬。我站在楼顶，看着脚下的街道变成了森林，路灯变成了萤火虫，整个城市都在呼吸。",
        "expected_emotion": "兴奋"
    },
    {
        "content": "我在雨中行走，每一滴雨珠都映照出一张脸——那些我曾在生命中遇见又匆匆告别的人。我张开手接住一滴，它在我手心里化作了泪水。",
        "expected_emotion": "悲伤"
    },
    {
        "content": "钟楼的钟声敲响第十三下，时间开始重叠。我看见早晨的自己与黄昏的自己擦肩而过，我们互不相识，却在同一个路口等红绿灯。",
        "expected_emotion": "焦虑"
    },
    {
        "content": "我潜入一口深井，井底不是水而是一片星空。我在星空中游泳，每一颗星都是一个记忆，我游过它们，像游过自己的一生。",
        "expected_emotion": "平静"
    },
    {
        "content": "风筝带我飞上云端，我低头看见地面的田野变成了一张巨大的乐谱。农民们是音符，他们在田垄间移动，演奏着大地无声的歌。",
        "expected_emotion": "愉悦"
    },
    {
        "content": "废弃的游乐园里，旋转木马开始转动，但上面坐的都是我童年的玩偶。它们看着我，眼神里满是责问——为什么把我一个人留在这里？",
        "expected_emotion": "忧郁"
    }
]

def insert_dreams():
    """插入梦境到数据库"""
    print(f"[INFO] 开始插入 {len(more_poetic_dreams)} 个高质量诗意梦境...")
    print()

    success_count = 0
    fail_count = 0

    for i, dream_data in enumerate(more_poetic_dreams, 1):
        content = dream_data["content"]
        expected = dream_data["expected_emotion"]

        try:
            response = requests.post(
                API_URL,
                json={
                    "user_id": USER_ID,
                    "content": content,
                    "is_private": False
                },
                timeout=15
            )

            if response.status_code == 200:
                result = response.json()
                emotion = result.get('emotion', {}).get('type', 'N/A')
                dream_id = result.get('id', 'N/A')

                # 检查情感分析是否准确
                match = "[MATCH]" if emotion == expected else f"[expected: {expected}]"

                print(f"{i}. [OK] 插入成功 (ID: {dream_id}) | 情感: {emotion} {match}")
                print(f"    内容: {content[:50]}...")
                print()
                success_count += 1
            else:
                print(f"{i}. [FAIL] HTTP {response.status_code}")
                print(f"    {response.text}")
                print()
                fail_count += 1

        except requests.exceptions.Timeout:
            print(f"{i}. [FAIL] 请求超时")
            print()
            fail_count += 1
        except Exception as e:
            print(f"{i}. [FAIL] {e}")
            print()
            fail_count += 1

    print(f"[DONE] 插入完成: 成功 {success_count}, 失败 {fail_count}")
    print(f"[INFO] 总梦境数: {success_count}")

if __name__ == "__main__":
    insert_dreams()
