"""
删除重复的梦境，保留ID较小的
"""
import yaspy
from database.connection import get_config

config = get_config()
conn = yaspy.connect(user=config.user, password=config.password, dsn=config.dsn)
cursor = conn.cursor()

# 重复的梦境ID（删除ID较大的，保留ID较小的）
duplicate_ids = [
    49,  # 与 ID 21 重复（钢琴）
    50,  # 与 ID 17 重复（镜子）
    51,  # 与 ID 16 重复（鲸鱼）
    52,  # 与 ID 15 重复（时钟）
    53,  # 与 ID 19 重复（灯塔）
    54,  # 与 ID 18 重复（图书馆）
    55,  # 与 ID 20 重复（地铁）
    56,  # 与 ID 23 重复（旧照片）
    57,  # 与 ID 24 重复（城市生长）
    58,  # 与 ID 22 重复（白鹭）
    59,  # 与 ID 25 重复（雨中行走）
    60,  # 与 ID 26 重复（钟楼）
    61,  # 与 ID 27 重复（深井）
    62,  # 与 ID 28 重复（风筝）
    63,  # 与 ID 29 重复（游乐园）
]

print("删除重复的梦境...")
print("=" * 60)

for dream_id in duplicate_ids:
    try:
        cursor.execute(f"DELETE FROM dream_records WHERE id = {dream_id}")
        conn.commit()
        print(f"[OK] 已删除 ID {dream_id}")
    except Exception as e:
        print(f"[FAIL] 删除 ID {dream_id} 失败: {e}")

print("=" * 60)

# 统计剩余数量
cursor.execute("SELECT COUNT(*) FROM dream_records")
total = cursor.fetchone()[0]
print(f"✨ 完成！数据库剩余 {total} 条梦境记录。")

cursor.close()
conn.close()
