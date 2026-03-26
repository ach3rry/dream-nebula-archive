# -*- coding: utf-8 -*-
"""Fix Chinese quotation marks in mock-data.ts"""

with open('lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Count Chinese quotation marks
left_quotes = content.count('"')
right_quotes = content.count('"')
print(f'Left quotes (\"): {left_quotes}')
print(f'Right quotes (\"): {right_quotes}')

# Replace Chinese quotation marks with escaped English ones
content = content.replace('"', '\\"')
content = content.replace('"', '\\"')

with open('lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced all Chinese quotation marks')
