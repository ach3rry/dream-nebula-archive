"use client"

import { useState } from "react"
import { Loader2, Sparkles, Cloud, Brain, Compass } from "lucide-react"
import { DreamExport } from "./dream-export"
import { interpretDream } from "@/lib/api-client"

interface InterpretationProps {
  dreamId: number
  dreamContent: string
  emotion?: {
    type: string
    score: number
    confidence: number
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

// 更准确的情感映射
const emotionIcons: Record<string, string> = {
  "平静": "🌙", "愉悦": "✨", "快乐": "✨",
  "忧郁": "🌫️", "悲伤": "💧", "痛苦": "💔",
  "恐惧": "👁️", "害怕": "😰",
  "兴奋": "🚀", "期待": "🌟",
  "焦虑": "⚡", "紧张": "😖",
  "愤怒": "🔥", "生气": "😠",
  "平静": "🌙", "宁静": "🌊"
}

export function DreamInterpretation({ dreamId, dreamContent, emotion }: InterpretationProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InterpretationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchInterpretation = async () => {
    if (result) return // 已有结果则不重复请求

    setLoading(true)
    setError(null)

    try {
      const data = await interpretDream(
        dreamContent,
        emotion?.type || "平静",
        emotion?.score || 0.5
      )
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
    <div className="relative group">
      {/* 动画边框渐变 */}
      <div className="absolute -inset-[2px] rounded-2xl opacity-40 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-border-flow" />

      {/* Glass container */}
      <div className="relative glass-card rounded-2xl p-6 md:p-8">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-border-flow">
                赛博周公解读
              </span>
            </h3>
            <p className="text-sm text-foreground/60">AI 梦境分析报告</p>
          </div>

          {/* 导出按钮 - 在解读完成后显示 */}
          <DreamExport
            dreamId={dreamId}
            dreamContent={dreamContent}
            dreamDate={new Date().toLocaleDateString("zh-CN")}
            emotion={emotion}
            interpretation={{
              summary: result.summary,
              psychological_meaning: result.psychological_meaning,
              life_guidance: result.life_guidance,
              mental_weather: result.mental_weather
            }}
          />
        </div>

      {/* 心灵天气预报 */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">心灵天气预报</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {result.mental_weather.forecast === "晴朗" && "☀️"}
            {result.mental_weather.forecast === "多云转晴" && "🌤️"}
            {result.mental_weather.forecast === "小雨" && "🌧️"}
            {result.mental_weather.forecast === "阵雨" && "⛈️"}
            {result.mental_weather.forecast === "雷暴" && "⛈️"}
            {result.mental_weather.forecast === "晴间多云" && "⛅"}
            {result.mental_weather.forecast === "阴天" && "☁️"}
            {result.mental_weather.forecast === "局部阴天" && "🌥️"}
            {!["晴朗", "多云转晴", "小雨", "阵雨", "雷暴", "晴间多云", "阴天", "局部阴天"].includes(result.mental_weather.forecast) && "🌈"}
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold text-foreground">{result.mental_weather.forecast}</div>
            <div className="text-sm text-foreground/70">{result.mental_weather.temp}</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-sm text-foreground/70">
          💡 {result.mental_weather.advice}
        </div>
      </div>

      {/* 梦境概要 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          梦境概要
        </h4>
        <p className="text-foreground/80 leading-relaxed">{result.summary}</p>
      </div>

      {/* 象征符号 */}
      {result.symbols && result.symbols.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            发现的象征符号
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.symbols.map((symbol, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {emotionIcons[symbol.mood] || "🔮"}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">{symbol.symbol}</div>
                    <div className="text-xs text-foreground/70">{symbol.meaning}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 心理学含义 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Brain className="w-4 h-4 text-primary" />
          心理学含义
        </h4>
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
          {result.psychological_meaning}
        </p>
      </div>

      {/* 潜意识信息 */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          潜意识信息
        </h4>
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
          {result.subconscious_message}
        </p>
      </div>

      {/* 生活指引 */}
      <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
          <Compass className="w-4 h-4 text-primary" />
          生活指引
        </h4>
        <p className="text-primary/90 leading-relaxed text-sm">{result.life_guidance}</p>
      </div>
      </div>
    </div>
  )
}
