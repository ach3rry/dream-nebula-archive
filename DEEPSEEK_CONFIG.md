# DeepSeek API 配置说明

## 重要提示

为了获得准确的情感分析和梦境解读功能，**必须配置真实的 DeepSeek API Key**。

## 配置步骤

### 1. 获取 DeepSeek API Key

1. 访问 DeepSeek 官网：https://platform.deepseek.com/
2. 注册账号并登录
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制保存你的 API Key（格式类似：`sk-xxxxxxxxxxxxx`）

### 2. 配置 API Key

编辑 `backend/.env` 文件，将 `DEEPSEEK_API_KEY` 替换为你的真实 API Key：

```bash
# 修改前
DEEPSEEK_API_KEY=your_api_key_here

# 修改后（示例）
DEEPSEEK_API_KEY=sk-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3. 重启后端服务

修改 `.env` 文件后，需要重启后端服务才能生效：

```bash
# 停止当前运行的后端服务（Ctrl+C）
# 然后重新启动
cd backend
python main.py
```

## API 功能说明

配置好 DeepSeek API Key 后，以下功能将使用 AI 进行分析：

### 1. 情感分析 (`/api/analysis/emotion`)

- **输入**: 梦境文本内容
- **输出**:
  - `emotion_type`: 情感类型（平静/愉悦/兴奋/焦虑/恐惧/忧郁/悲伤）
  - `emotion_score`: 情感强度（0.1-1.0）
  - `keywords`: 关键词提取
  - `summary`: 梦境摘要

### 2. 梦境解读 (`/api/interpretation/analyze`)

- **输入**: 梦境内容 + 情感分析结果
- **输出**:
  - `summary`: 梦境概要（诗意描述）
  - `psychological_meaning`: 心理学含义分析
  - `subconscious_message`: 潜意识信息解读
  - `life_guidance`: 生活指引建议
  - `mental_weather`: 心灵天气预报

## 兜底方案

如果没有配置 API Key 或 API 调用失败，系统会使用基于规则的兜底方案：

- **情感分析**: 使用扩展的关键词匹配逻辑
- **梦境解读**: 使用预定义的象征符号库和心理模板

兜底方案的分析准确度会较低，建议配置真实的 API Key。

## 测试 API 配置

启动后端服务后，可以访问以下地址测试：

```
http://localhost:8000/api/analysis/health
```

返回示例：
```json
{
  "status": "healthy",
  "service": "AI Analysis API",
  "features": {
    "emotion_analysis": true,
    "keyword_extraction": true,
    "nebula_generation": true
  },
  "deepseek_configured": true
}
```

如果 `deepseek_configured` 为 `true`，说明 API Key 已正确配置。

## 费用说明

DeepSeek API 按使用量计费：

- 情感分析: 约 500 tokens/次
- 梦境解读: 约 1000 tokens/次

具体价格请参考 DeepSeek 官网定价：https://platform.deepseek.com/pricing

## 常见问题

### Q: API 调用失败怎么办？
A: 检查 API Key 是否正确，网络是否正常，后端服务是否正在运行。

### Q: 分析结果不准确？
A: 确保使用的是 DeepSeek API 而不是兜底方案。兜底方案的分析准确度较低。

### Q: 如何查看是否使用了 AI 分析？
A: 查看后端日志，如果有 `[OK] Emotion analyzed` 或类似输出，说明使用了 AI 分析。

## 技术支持

如遇到问题，请检查：
1. 后端服务是否正常运行
2. `.env` 文件配置是否正确
3. API Key 是否有效
4. 网络连接是否正常
