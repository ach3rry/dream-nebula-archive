# AI 分析 API 使用文档

## 概述

梦境星云档案馆提供了一套 AI 分析 API，用于分析梦境内容、提取关键词、生成星云视觉效果等。

---

## 🔑 基础配置

### 环境变量

在 `.env` 文件中配置：

```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY=your_actual_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# AI 分析配置
AI_ENABLED=true
AI_FALLBACK_TO_RULES=true
```

### 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

---

## 📡 API 端点

### 1. 情感分析

**端点**: `POST /api/analysis/emotion`

**功能**: 使用 AI 分析梦境的情感

**请求示例**:
```json
{
  "dream_content": "我梦见自己飞翔在紫色的星空中，周围有许多闪亮的星星，感觉非常自由和快乐。"
}
```

**响应示例**:
```json
{
  "emotion_type": "JOYFUL",
  "emotion_label": "愉悦",
  "emotion_score": 0.75,
  "confidence": 0.85,
  "keywords": ["飞翔", "紫色", "星空", "星星", "自由"],
  "summary": "在星空中自由飞翔的愉悦梦境"
}
```

**情感类型**:
- `CALM` - 平静
- `SAD` - 悲伤
- `FEAR` - 恐惧
- `EXCITED` - 兴奋
- `ANXIOUS` - 焦虑
- `MELANCHOLY` - 忧郁
- `JOYFUL` - 愉悦

---

### 2. 关键词提取

**端点**: `POST /api/analysis/keywords`

**功能**: 从梦境中提取关键词和标签

**请求示例**:
```json
{
  "dream_content": "我和妈妈在家附近的公园散步，看到了很多美丽的蝴蝶"
}
```

**响应示例**:
```json
{
  "elements": [
    {"word": "公园", "category": "场景"},
    {"word": "蝴蝶", "category": "动物"}
  ],
  "symbols": [],
  "emotions": ["美丽"],
  "entities": ["妈妈", "公园", "蝴蝶"],
  "tags": ["场景:公园", "动物:蝴蝶", "情绪:美丽"]
}
```

---

### 3. 星云生成

**端点**: `POST /api/analysis/nebula`

**功能**: 根据梦境生成 3D 星云视觉效果参数

**请求示例**:
```json
{
  "dream_content": "飞翔在紫色的星空中",
  "emotion": "CALM",
  "dream_id": 1
}
```

**响应示例**:
```json
{
  "seed": 123456789,
  "emotion": "CALM",
  "colors": {
    "primary": "#99b3e6",
    "secondary": "#8080b3",
    "accent": "#cce6ff"
  },
  "particles": {
    "count": 550,
    "size": {"min": 0.5, "max": 3.0},
    "speed": {"min": 0.01, "max": 0.05}
  },
  "clouds": [
    {
      "id": 0,
      "color": "#8080b3",
      "opacity": 0.35,
      "scale": 1.5,
      "blur": 30
    }
  ],
  "effects": {
    "glow": {"enabled": true},
    "twinkle": {"enabled": true}
  },
  "stars": [...]
}
```

---

## 💡 使用示例

### Python 示例

```python
import requests

# 情感分析
response = requests.post(
    "http://localhost:8001/api/analysis/emotion",
    json={"dream_content": "我梦见自己在星空下飞翔"}
)
print(response.json())

# 关键词提取
response = requests.post(
    "http://localhost:8001/api/analysis/keywords",
    json={"dream_content": "梦见和朋友去海边度假"}
)
print(response.json())

# 星云生成
response = requests.post(
    "http://localhost:8001/api/analysis/nebula",
    json={
        "dream_content": "宁静的星空之夜",
        "emotion": "CALM",
        "dream_id": 1
    }
)
print(response.json())
```

### JavaScript/TypeScript 示例

```javascript
// 情感分析
const response = await fetch('http://localhost:8001/api/analysis/emotion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dream_content: '我梦见自己在星空下飞翔'
  })
});
const result = await response.json();
console.log(result);
```

---

## ⚠️ 注意事项

### 1. AI 服务可用性

- 如果未配置 `DEEPSEEK_API_KEY`，系统会使用规则引擎作为后备
- 规则引擎提供基础的情感分析和关键词提取

### 2. 异步处理

- 情感分析端点需要异步处理（async/await）
- 建议在生产环境中添加队列处理

### 3. 性能考虑

- 星云生成参数基于内容哈希，相同内容会生成相同结果
- 星星位置基于 dream_id，保证每个梦境有独特的星空

---

## 🔧 开发调试

### 测试端点

```bash
# 健康检查
curl http://localhost:8001/api/analysis/health
```

### 查看日志

```bash
# 查看后端日志
cd backend
python main.py
```

---

## 📚 相关文档

- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [项目主文档](../DEVELOPMENT.md)
