"use client"

import { useEffect, useState } from "react"
import { DreamCard } from "./dream-card"
import { EmotionChart } from "./emotion-chart"
import { Loader2, Search, Filter, PieChart, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Dream {
  id: number
  content: string
  emotion?: {
    type: string
    score: number
    confidence: number
  }
  keywords?: string[]
  created_at: string
}

interface DreamFeedProps {
  onOpenNebula?: (dreams: Dream[]) => void
}

// Fallback sample dreams for display
const sampleDreams = [
  {
    id: 1,
    title: "紫色星云中的漂流",
    date: "2026-03-23",
    mood: "mystical" as const,
    summary: "我发现自己漂浮在一片无边无际的紫色星云中，周围是闪烁的星辰。每当我伸出手去触碰一颗星星，它就会变成一只发光的蝴蝶飞向远方...",
  },
  {
    id: 2,
    title: "深海中的水晶宫殿",
    date: "2026-03-22",
    mood: "peaceful" as const,
    summary: "在梦中我潜入了一片幽蓝的深海，发现了一座由透明水晶建造的宫殿。宫殿里的每个房间都播放着不同的记忆，像是全息投影一般...",
  },
  {
    id: 3,
    title: "穿越时空的列车",
    date: "2026-03-21",
    mood: "adventurous" as const,
    summary: "我登上了一列穿梭于不同时代的银色列车。每一节车厢都通向不同的历史时期，我在古罗马、未来都市和恐龙时代之间自由穿行...",
  },
]

// 情感类型选项
const emotionTypes = [
  { value: "", label: "全部情感", icon: "🌌" },
  { value: "平静", label: "平静", icon: "🌙" },
  { value: "愉悦", label: "愉悦", icon: "✨" },
  { value: "忧郁", label: "忧郁", icon: "🌫️" },
  { value: "悲伤", label: "悲伤", icon: "💧" },
  { value: "恐惧", label: "恐惧", icon: "👁️" },
  { value: "兴奋", label: "兴奋", icon: "🚀" },
  { value: "焦虑", label: "焦虑", icon: "⚡" },
]

export function DreamFeed({ onOpenNebula }: DreamFeedProps) {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 筛选状态
  const [selectedEmotion, setSelectedEmotion] = useState("")
  const [keywordFilter, setKeywordFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const response = await fetch("/api/dreams")
        if (!response.ok) {
          throw new Error("Failed to fetch dreams")
        }
        const data: Dream[] = await response.json()
        setDreams(data)
      } catch (err) {
        console.error("Error fetching dreams:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchDreams()
  }, [])

  // 筛选梦境
  useEffect(() => {
    let filtered = [...dreams]

    // 按情感筛选
    if (selectedEmotion) {
      filtered = filtered.filter(dream =>
        dream.emotion?.type === selectedEmotion
      )
    }

    // 按关键词筛选
    if (keywordFilter.trim()) {
      const keyword = keywordFilter.toLowerCase()
      filtered = filtered.filter(dream =>
        dream.content.toLowerCase().includes(keyword) ||
        dream.keywords?.some(k => k.toLowerCase().includes(keyword))
      )
    }

    setFilteredDreams(filtered)
  }, [dreams, selectedEmotion, keywordFilter])

  // 智能标题生成函数
  const generateDreamTitle = (content: string): string => {
    const titleMap: Record<string, string> = {
      "紫色星云": "紫色星云中的漂流",
      "深海": "深海中的水晶宫殿",
      "列车": "穿越时空的列车",
      "镜子": "镜子迷宫",
      "童年": "消失的童年小屋",
      "星座": "会说话的星座",
    }

    for (const [keyword, title] of Object.entries(titleMap)) {
      if (content.includes(keyword)) {
        return title
      }
    }

    // 默认标题
    return content.length > 20 ? content.slice(0, 20) + "..." : content
  }

  // Map backend dream data to display format
  const displayDreams: Array<{
    id: number
    title: string
    date: string
    mood: string
    summary: string
  }> = filteredDreams.length > 0
    ? filteredDreams.map((dream) => ({
        id: dream.id,
        title: generateDreamTitle(dream.content),
        date: new Date(dream.created_at).toLocaleDateString("zh-CN"),
        mood: dream.emotion?.type || "mystical",
        summary: dream.content.slice(0, 100) + (dream.content.length > 100 ? "..." : ""),
      }))
    : dreams.length === 0 ? sampleDreams.map(dream => ({
        id: dream.id,
        title: dream.title,
        date: dream.date,
        mood: dream.mood,
        summary: dream.summary
      })) : []

  // 清除筛选
  const clearFilters = () => {
    setSelectedEmotion("")
    setKeywordFilter("")
  }
  return (
    <section id="archive" className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            梦境档案
          </span>
        </h2>
        <p className="text-muted-foreground mb-6">
          漂浮在虚空中的星云碎片，每一个都承载着独特的梦境
        </p>

        {/* 星云可视化按钮 */}
        {!loading && !error && dreams.length > 0 && onOpenNebula && (
          <button
            onClick={() => onOpenNebula(dreams)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]"
          >
            <span className="text-lg">✨</span>
            <span className="font-medium">进入梦境星云</span>
          </button>
        )}
      </div>

      {/* 筛选器 */}
      {!loading && !error && dreams.length > 0 && (
        <div className="mb-8">
          {/* 筛选和统计按钮 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* 筛选按钮 - v0.dev glass style */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "glass-card",
                "hover:scale-[1.02]",
                "hover:shadow-[0_0_40px_rgba(0,245,255,0.15),0_0_80px_rgba(255,0,255,0.1)]",
                "transition-all duration-500 ease-out",
                "overflow-hidden"
              )}
            >
              {/* Multi-layer glow effect */}
              <div className={cn(
                "absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100",
                "bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30",
                "blur-md transition-opacity duration-500"
              )} />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )} />

              {/* Content */}
              <Filter className={cn(
                "w-4 h-4 relative z-10",
                "transition-transform duration-300",
                showFilters ? "rotate-180" : ""
              )} />
              <span className="text-sm font-medium relative z-10">筛选梦境</span>
              <span className="text-xs text-muted-foreground relative z-10">
                {showFilters ? "收起" : "展开"}
              </span>
            </button>

            {/* 统计按钮 - v0.dev glass style */}
            <button
              onClick={() => setShowChart(!showChart)}
              className={cn(
                "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "glass-card",
                "hover:scale-[1.02]",
                "hover:shadow-[0_0_40px_rgba(255,0,255,0.15),0_0_80px_rgba(0,245,255,0.1)]",
                "transition-all duration-500 ease-out",
                "overflow-hidden"
              )}
            >
              {/* Multi-layer glow effect */}
              <div className={cn(
                "absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100",
                "bg-gradient-to-r from-secondary/30 via-primary/30 to-secondary/30",
                "blur-md transition-opacity duration-500"
              )} />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )} />

              {/* Content */}
              <PieChart className={cn(
                "w-4 h-4 relative z-10",
                "transition-transform duration-300 group-hover:rotate-12"
              )} />
              <span className="text-sm font-medium relative z-10">情感统计</span>
              <span className="text-xs text-muted-foreground relative z-10">
                {showChart ? "收起" : "展开"}
              </span>
            </button>

            {/* 筛选状态提示 - glass style */}
            {(selectedEmotion || keywordFilter) && (
              <div className={cn(
                "group relative inline-flex items-center gap-3 px-4 py-2 rounded-xl",
                "glass-card",
                "animate-float",
                "overflow-hidden"
              )}>
                {/* Glow effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5",
                  "opacity-50"
                )} />

                <span className="text-sm text-muted-foreground relative z-10">
                  已筛选: <span className="text-primary font-medium">{filteredDreams.length}</span> / {dreams.length}
                </span>
                <button
                  onClick={clearFilters}
                  className={cn(
                    "group/clear relative inline-flex items-center gap-1 px-2 py-1 rounded-lg",
                    "bg-primary/10 hover:bg-primary/20",
                    "border border-primary/20 hover:border-primary/40",
                    "transition-all duration-300"
                  )}
                >
                  <X className="w-3 h-3 transition-transform group-hover/clear:rotate-90" />
                  <span className="text-xs text-primary">清除</span>
                </button>
              </div>
            )}
          </div>

          {/* 筛选面板 - v0.dev glass style */}
          {showFilters && (
            <div className={cn(
              "group relative max-w-2xl mx-auto p-8 rounded-2xl",
              "glass-card",
              "hover:shadow-[0_0_60px_rgba(0,245,255,0.1),0_0_100px_rgba(255,0,255,0.05)]",
              "transition-all duration-500 ease-out",
              "space-y-6"
            )}>
              {/* Gradient border animation */}
              <div className={cn(
                "absolute -inset-[2px] rounded-2xl opacity-75 blur-sm transition-opacity duration-500",
                "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-border-flow"
              )} />

              {/* 情感筛选 - Premium button grid */}
              <div className="relative z-10">
                <label className={cn(
                  "block text-sm font-medium mb-4",
                  "text-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                )}>
                  按情感筛选
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotionTypes.map((emotion, index) => (
                    <button
                      key={emotion.value}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className={cn(
                        "group/btn relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full",
                        "transition-all duration-300 ease-out",
                        "overflow-hidden",
                        // Base style
                        "glass-card",
                        // Hover effects
                        "hover:scale-105",
                        "hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]",
                        // Selected state
                        selectedEmotion === emotion.value && [
                          "ring-2 ring-primary/50",
                          "shadow-[0_0_30px_rgba(0,245,255,0.4)]",
                          "bg-gradient-to-r from-primary/20 to-secondary/20"
                        ],
                        // Animation delay for stagger effect
                        "animate-float",
                        `animation-delay-${index * 100}`
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Glow on hover */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r from-primary/0 to-secondary/0",
                        "group-hover/btn:from-primary/20 group-hover/btn:to-secondary/20",
                        "transition-all duration-300"
                      )} />

                      <span className="relative z-10 text-base">{emotion.icon}</span>
                      <span className={cn(
                        "relative z-10 text-sm font-medium",
                        selectedEmotion === emotion.value
                          ? "text-primary"
                          : "text-muted-foreground group-hover/btn:text-foreground"
                      )}>
                        {emotion.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 关键词搜索 - Premium input */}
              <div className="relative z-10">
                <label className={cn(
                  "block text-sm font-medium mb-4",
                  "text-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
                )}>
                  按关键词搜索
                </label>
                <div className={cn(
                  "group/search relative",
                  "transition-all duration-300"
                )}>
                  {/* Glow effect */}
                  <div className={cn(
                    "absolute -inset-[1px] rounded-xl opacity-0 group-focus-within/search:opacity-100",
                    "bg-gradient-to-r from-primary/30 to-secondary/30",
                    "blur-md transition-opacity duration-300"
                  )} />

                  {/* Search icon with glow */}
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 z-20",
                    "transition-colors duration-300"
                  )}>
                    <Search className={cn(
                      "w-5 h-5",
                      keywordFilter ? "text-primary animate-pulse" : "text-muted-foreground"
                    )} />
                  </div>

                  {/* Input field */}
                  <input
                    type="text"
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    placeholder="搜索梦境内容或关键词..."
                    className={cn(
                      "relative z-10 w-full pl-12 pr-12 py-3 rounded-xl",
                      "glass-card",
                      "focus:outline-none",
                      "transition-all duration-300",
                      "placeholder:text-muted-foreground/50",
                      // Focus glow
                      "focus:shadow-[0_0_30px_rgba(0,245,255,0.2)]"
                    )}
                  />

                  {/* Clear button */}
                  {keywordFilter && (
                    <button
                      onClick={() => setKeywordFilter("")}
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 z-20",
                        "p-1.5 rounded-lg",
                        "bg-primary/10 hover:bg-primary/20",
                        "transition-all duration-300",
                        "hover:scale-110"
                      )}
                    >
                      <X className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 情感统计图表 - v0.dev glass style */}
          {showChart && (
            <div className={cn(
              "group relative max-w-2xl mx-auto p-8 rounded-2xl",
              "glass-card",
              "hover:shadow-[0_0_60px_rgba(255,0,255,0.1),0_0_100px_rgba(0,245,255,0.05)]",
              "transition-all duration-500 ease-out"
            )}>
              {/* Gradient border animation */}
              <div className={cn(
                "absolute -inset-[2px] rounded-2xl opacity-75 blur-sm transition-opacity duration-500",
                "bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_auto] animate-border-flow"
              )} />

              {/* Inner glow */}
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 opacity-50",
                "group-hover:opacity-75 transition-opacity duration-300"
              )} />

              {/* Chart content */}
              <div className="relative z-10">
                <EmotionChart dreams={dreams} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">无法加载梦境档案</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Dream Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDreams.map((dream, index) => (
            <DreamCard
              key={dream.id}
              id={dream.id}
              title={dream.title}
              date={dream.date}
              mood={dream.mood}
              summary={dream.summary}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Empty state hint */}
      {!loading && !error && displayDreams.length === 0 && (
        <div className="text-center py-12">
          {dreams.length === 0 ? (
            <p className="text-muted-foreground">
              还没有梦境记录，开始记录你的第一个梦境吧！
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                没有匹配的梦境
              </p>
              <button
                onClick={clearFilters}
                className="text-primary hover:underline text-sm"
              >
                清除筛选条件
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
