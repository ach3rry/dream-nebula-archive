"""
合并所有解读到 mock-data.ts
"""
import json
from pathlib import Path

# 读取解读文件
interp_file_10 = Path(__file__).parent / "interpretations_10.json"
interp_file_rest = Path(__file__).parent / "interpretations_11_32.json"

with open(interp_file_10, "r", encoding="utf-8") as f:
    interp_10 = json.load(f)

# 检查是否有后续解读
has_rest = interp_file_rest.exists()
if has_rest:
    with open(interp_file_rest, "r", encoding="utf-8") as f:
        interp_rest = json.load(f)
    # 合并
    all_interpretations = {**interp_10, **interp_rest}
else:
    all_interpretations = interp_10

print(f"Loaded {len(all_interpretations)} interpretations")

# 生成 mockInterpretations 的 TypeScript 代码
ts_code = "// 模拟解读数据 - 由 DeepSeek AI 生成\n\nexport const mockInterpretations: Record<number, MockInterpretation> = {\n"

for dream_id in sorted(all_interpretations.keys(), key=int):
    interp = all_interpretations[dream_id]
    if interp is None:
        continue

    ts_code += f"  {dream_id}: {{\n"
    ts_code += f"    summary: \"{interp['summary'].replace('\"', '\\\"')}\",\n"

    # symbols
    ts_code += "    symbols: [\n"
    for symbol in interp.get('symbols', []):
        ts_code += f"      {{ symbol: \"{symbol['symbol']}\", meaning: \"{symbol['meaning'].replace('\"', '\\\"')}\", mood: \"{symbol['mood']}\" }},\n"
    ts_code += "    ],\n"

    # 其他字段
    ts_code += f"    psychological_meaning: \"{interp['psychological_meaning'].replace('\"', '\\\"')}\",\n"
    ts_code += f"    subconscious_message: \"{interp['subconscious_message'].replace('\"', '\\\"')}\",\n"
    ts_code += f"    life_guidance: \"{interp['life_guidance'].replace('\"', '\\\"')}\",\n"
    ts_code += f"    mental_weather: {{ forecast: \"{interp['mental_weather']['forecast']}\", temp: \"{interp['mental_weather']['temp']}\", advice: \"{interp['mental_weather']['advice'].replace('\"', '\\\"')}\" }}\n"
    ts_code += "  },\n\n"

ts_code += "}\n"

# 输出到文件
output_file = Path(__file__).parent.parent / "lib" / "interpretations_generated.ts"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(ts_code)

print(f"Generated TypeScript file: {output_file}")
print(f"Total interpretations: {len(all_interpretations)}")
