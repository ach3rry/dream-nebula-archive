"use client"

import { useState } from "react"
import { Loader2, Sparkles, Cloud, Brain, Compass } from "lucide-react"

interface InterpretationProps {
  dreamId: number
  dreamContent: string
  emotion?: {
    type: string
    score: number
  }
}

interface InterpretationResult {
  summary: string
  symbols: Array<{
    symbol: string
    meaning: string
    mood: string
  }>
  psychological_meaning: string
  subconscious_message: string
  life_guidance: string
  mental_weather: {
    forecast: string
    temp: string
    advice: string
  }
}

const emotionIcons: Record<string, string> = {
  "平静": "🌙", "愉悦": "✨", "忧郁": "🌫️",
  "悲伤": "💧", "恐惧": "👁️", "兴奋": "🚀", "焦虑": "⚡"
}

export function DreamInterpretation({ dreamId, dreamContent, emotion }: InterpretationProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InterpretationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showFull, setShowFull] = useState(false)

  const fetchInterpretation = async () => {
    if (result) return // 已有结果则不重复请求

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/interpretation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dream_content: dreamContent,
          emotion_type: emotion?.type || "平静",
          emotion_score: emotion?.score || 0.5
        })
      })

      if (!response.ok) {
        throw new Error("解读失败")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">赛博周公正解读你的梦境...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchInterpretation}
          className="px-6 py-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3">需要解读这个梦境吗？</h3>
        <p className="text-muted-foreground mb-6">
          赛博周公将通过心理学分析，为你解读梦境中的象征符号和潜意识信息
        </p>
        <button
          onClick={fetchInterpretation}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 hover:from-primary/40 hover:to-secondary/40 border border-primary/30 transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>开始解读</span>
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">赛博周公解读</h3>
          <p className="text-sm text-muted-foreground">AI 梦境分析报告</p>
        </div>
      </div>

      {/* 心灵天气预报 */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-primary" />
          <span className="font-medium">心灵天气预报</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl">
            {result.mental_weather.forecast === "晴朗" && "☀️"}
            {result.mental_weather.forecast === "多云转晴" && "🌤️"}
            {result.mental_weather.forecast === "小雨" && "🌧️"}
            {result.mental_weather.forecast === "阵雨" && "⛈️"}
            {result.mental_weather.forecast === "雷暴" && "⛈️"}
            {result.mental_weather.forecast === "晴间多云" && "⛅"}
            {result.mental_weather.forecast === "阴天" && "☁️"}
            {result.mental_weather.forecast === "局部阴天" && "🌥️"}
          </div>
          <div className="flex-1">
            <div className="font-semibold">{result.mental_weather.forecast}</div>
            <div className="text-sm text-muted-foreground">{result.mental_weather.temp}</div>
          </div>
          <div className="text-sm text-muted-foreground max-w-xs">
            {result.mental_weather.advice}
          </div>
        </div>
      </div>

      {/* 梦境概要 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          梦境概要
        </h4>
        <p className="text-muted-foreground">{result.summary}</p>
      </div>

      {/* 象征符号 */}
      {result.symbols && result.symbols.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            发现的象征符号
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.symbols.map((symbol, index) => (
              <div
                key={index}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {emotionIcons[symbol.mood] || "🔮"}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{symbol.symbol}</div>
                    <div className="text-xs text-muted-foreground">{symbol.meaning}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 心理学含义 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          心理学含义
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
          {result.psychological_meaning}
        </p>
      </div>

      {/* 潜意识信息 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          潜意识信息
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
          {result.subconscious_message}
        </p>
      </div>

      {/* 生活指引 */}
      <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          生活指引
        </h4>
        <p className="text-sm text-primary/90">{result.life_guidance}</p>
      </div>

      {/* 展开更多 */}
      {!showFull && (
        <button
          onClick={() => setShowFull(true)}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          点击展开完整解读
        </button>
      )}
    </div>
  )
}
