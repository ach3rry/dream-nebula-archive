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

    def escape_for_ts(text):
        """Escape Chinese quotation marks and backslashes for TypeScript strings"""
        if not text:
            return ""
        # IMPORTANT: Order matters!
        # 1. First replace Chinese quotation marks (before any backslash escaping)
        text = text.replace('\u201c', '"')   # Left double quotation mark -> regular quote
        text = text.replace('\u201d', '"')   # Right double quotation mark -> regular quote
        text = text.replace('\u2018', "'")   # Left single quotation mark -> regular quote
        text = text.replace('\u2019', "'")   # Right single quotation mark -> regular quote
        # 2. Then escape backslashes (so existing backslashes don't cause issues)
        text = text.replace('\\', '\\\\')
        # 3. Then escape regular quotes and newlines
        text = text.replace('"', '\\"')
        text = text.replace("'", "\\'")
        text = text.replace('\n', '\\n')
        text = text.replace('\r', '')
        return text

    ts_code += f"  {dream_id}: {{\n"
    ts_code += f"    summary: \"{escape_for_ts(interp['summary'])}\",\n"

    # symbols
    ts_code += "    symbols: [\n"
    for symbol in interp.get('symbols', []):
        ts_code += f"      {{ symbol: \"{escape_for_ts(symbol['symbol'])}\", meaning: \"{escape_for_ts(symbol['meaning'])}\", mood: \"{escape_for_ts(symbol['mood'])}\" }},\n"
    ts_code += "    ],\n"

    # 其他字段
    ts_code += f"    psychological_meaning: \"{escape_for_ts(interp['psychological_meaning'])}\",\n"
    ts_code += f"    subconscious_message: \"{escape_for_ts(interp['subconscious_message'])}\",\n"
    ts_code += f"    life_guidance: \"{escape_for_ts(interp['life_guidance'])}\",\n"
    ts_code += f"    mental_weather: {{ forecast: \"{escape_for_ts(interp['mental_weather']['forecast'])}\", temp: \"{escape_for_ts(interp['mental_weather']['temp'])}\", advice: \"{escape_for_ts(interp['mental_weather']['advice'])}\" }}\n"
    ts_code += "  },\n\n"

ts_code += "}\n"

# 输出到文件
output_file = Path(__file__).parent.parent / "lib" / "interpretations_generated.ts"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(ts_code)

print(f"Generated TypeScript file: {output_file}")
print(f"Total interpretations: {len(all_interpretations)}")
