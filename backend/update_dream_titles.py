"""
更新梦境标题
"""
import requests
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_URL = "http://localhost:8001/api/dreams"

# 梦境内容到标题的映射
dream_titles = {
    "紫色星云": "紫色星云中的漂流",
    "深海": "深海中的水晶宫殿",
    "列车": "穿越时空的列车",
    "镜子": "镜子迷宫",
    "童年": "消失的童年小屋",
    "星座": "会说话的星座",
}

def generate_title(content: str) -> str:
    """根据内容生成标题"""
    for keyword, title in dream_titles.items():
        if keyword in content:
            return title

    # 默认标题：取前15个字
    return content[:15] + "..." if len(content) > 15 else content

def update_dream_titles():
    """更新所有梦境的标题"""
    # 获取所有梦境
    response = requests.get(f"{API_URL}?user_id=1&page=1&page_size=50")
    if response.status_code != 200:
        print(f"Failed to fetch dreams: {response.status_code}")
        return

    data = response.json()
    dreams = data.get("dreams", [])

    print(f"Found {len(dreams)} dreams")
    print("=" * 50)

    for dream in dreams:
        dream_id = dream["id"]
        content = dream["content"]

        # 生成标题
        title = generate_title(content)

        # 更新梦境
        update_response = requests.put(
            f"{API_URL}/{dream_id}",
            json={"content": content},
            timeout=10
        )

        if update_response.status_code == 200:
            print(f"✅ ID {dream_id}: {title}")
        else:
            print(f"❌ ID {dream_id}: Failed - {update_response.status_code}")

if __name__ == "__main__":
    print("📝 开始更新梦境标题...")
    print("=" * 50)
    update_dream_titles()
    print("=" * 50)
    print("✨ 完成！")
