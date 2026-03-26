"""
检查所有梦境内容，找出重复或相似的
"""
import yaspy
from database.connection import get_config

config = get_config()
conn = yaspy.connect(user=config.user, password=config.password, dsn=config.dsn)
cursor = conn.cursor()

cursor.execute('SELECT id, content FROM dream_records ORDER BY id DESC')
rows = cursor.fetchall()

print('所有梦境列表：')
print('=' * 80)
for row in rows:
    content = row[1]
    # 截取前80个字符显示
    display = content[:80] + '...' if len(content) > 80 else content
    print(f'ID {row[0]}: {display}')

print('\n' + '=' * 80)
print(f'总共 {len(rows)} 条梦境')

cursor.close()
conn.close()
