"""Update mock-data.ts with properly escaped interpretations"""
from pathlib import Path

# Paths
mock_data_file = Path(__file__).parent.parent / "lib" / "mock-data.ts"
interpretations_file = Path(__file__).parent.parent / "lib" / "interpretations_generated.ts"

# Read the mock-data.ts file (up to line 334, before mockInterpretations)
with open(mock_data_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find where mockInterpretations starts
interp_start_idx = None
for i, line in enumerate(lines):
    if "export const mockInterpretations" in line:
        interp_start_idx = i
        break

if interp_start_idx is None:
    print("ERROR: Could not find mockInterpretations section")
    exit(1)

print(f"Found mockInterpretations at line {interp_start_idx + 1}")

# Keep everything before mockInterpretations
header = "".join(lines[:interp_start_idx])

# Read the properly escaped interpretations
with open(interpretations_file, "r", encoding="utf-8") as f:
    escaped_interpretations = f.read()

# Write back to mock-data.ts
with open(mock_data_file, "w", encoding="utf-8") as f:
    f.write(header)
    f.write(escaped_interpretations)
    f.write("\n")  # Add final newline

print(f"Updated {mock_data_file}")
print(f"Replaced mockInterpretations section (line {interp_start_idx + 1}+) with properly escaped version")
