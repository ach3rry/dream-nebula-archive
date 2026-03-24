import re

with open('api/dreams.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 移除所有 Depends(get_connection)
content = re.sub(r',\s*conn=Depends\(get_connection\)', '', content)
content = re.sub(r'conn=Depends\(get_connection\),\s*', '', content)

# 将所有 async def 改为 def（除了文档字符串）
# 但保留已经是普通 def 的函数
lines = content.split('\n')
new_lines = []
for i, line in enumerate(lines):
    if 'async def ' in line and 'def get_dream' in line or 'def update_dream' in line or 'def delete_dream' in line:
        new_lines.append(line.replace('async def ', 'def '))
    else:
        new_lines.append(line)

content = '\n'.join(new_lines)

with open('api/dreams.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
