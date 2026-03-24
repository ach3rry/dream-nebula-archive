"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface EmotionData {
  type: string
  count: number
  percentage: number
}

interface EmotionChartProps {
  dreams: Array<{
    emotion?: {
      type: string
    }
  }>
}

// 情感类型配置 - Premium gradient colors
const emotionConfig: Record<string, {
  icon: string
  label: string
  fromColor: string
  toColor: string
  glowColor: string
}> = {
  "平静": {
    icon: "🌙",
    label: "平静",
    fromColor: "from-blue-500",
    toColor: "to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.5)"
  },
  "愉悦": {
    icon: "✨",
    label: "愉悦",
    fromColor: "from-purple-500",
    toColor: "to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.5)"
  },
  "忧郁": {
    icon: "🌫️",
    label: "忧郁",
    fromColor: "from-purple-400",
    toColor: "to-violet-500",
    glowColor: "rgba(147, 51, 234, 0.5)"
  },
  "悲伤": {
    icon: "💧",
    label: "悲伤",
    fromColor: "from-blue-400",
    toColor: "to-indigo-500",
    glowColor: "rgba(96, 165, 250, 0.5)"
  },
  "恐惧": {
    icon: "👁️",
    label: "恐惧",
    fromColor: "from-red-500",
    toColor: "to-orange-500",
    glowColor: "rgba(239, 68, 68, 0.5)"
  },
  "兴奋": {
    icon: "🚀",
    label: "兴奋",
    fromColor: "from-yellow-500",
    toColor: "to-amber-500",
    glowColor: "rgba(234, 179, 8, 0.5)"
  },
  "焦虑": {
    icon: "⚡",
    label: "焦虑",
    fromColor: "from-orange-500",
    toColor: "to-red-500",
    glowColor: "rgba(249, 115, 22, 0.5)"
  },
}

export function EmotionChart({ dreams }: EmotionChartProps) {
  // 计算情感分布
  const emotionData = useMemo(() => {
    const counts: Record<string, number> = {}

    // 初始化计数
    Object.keys(emotionConfig).forEach(type => {
      counts[type] = 0
    })

    // 统计每个情感的数量
    dreams.forEach(dream => {
      const emotion = dream.emotion?.type
      if (emotion && emotion in counts) {
        counts[emotion]++
      }
    })

    const total = dreams.length
    const data: EmotionData[] = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)

    return data
  }, [dreams])

  const totalDreams = dreams.length

  if (totalDreams === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-12 space-y-4"
      )}>
        <div className={cn(
          "text-5xl opacity-50 animate-pulse"
        )}>
          💭
        </div>
        <p className={cn(
          "text-muted-foreground text-sm",
          "bg-gradient-to-r from-primary/50 to-secondary/50 bg-clip-text text-transparent"
        )}>
          还没有梦境数据
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 标题 - Premium style */}
      <div className={cn(
        "text-center space-y-2"
      )}>
        <h3 className={cn(
          "text-xl font-bold",
          "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-bg-shift bg-clip-text text-transparent"
        )}>
          情感分布统计
        </h3>
        <p className={cn(
          "text-sm text-muted-foreground",
          "flex items-center justify-center gap-2"
        )}>
          <span className={cn(
            "inline-flex items-center justify-center w-2 h-2 rounded-full",
            "bg-primary animate-pulse"
          )} />
          共 {totalDreams} 个梦境
        </p>
      </div>

      {/* 水平条形图 - Premium glass style */}
      <div className="space-y-4">
        {emotionData.map(({ type, count, percentage }, index) => {
          const config = emotionConfig[type]
          return (
            <div
              key={type}
              className={cn(
                "group/bar relative space-y-2",
                "animate-float"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Label row */}
              <div className={cn(
                "flex items-center justify-between text-sm"
              )}>
                <span className={cn(
                  "flex items-center gap-2",
                  "transition-transform duration-300 group-hover/bar:scale-105"
                )}>
                  <span className={cn(
                    "text-lg",
                    "transition-transform duration-300 group-hover/bar:rotate-12"
                  )}>
                    {config.icon}
                  </span>
                  <span className={cn(
                    "font-medium",
                    "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  )}>
                    {config.label}
                  </span>
                </span>
                <span className={cn(
                  "flex items-center gap-2",
                  "text-muted-foreground text-xs"
                )}>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full",
                    "bg-gradient-to-r from-primary/10 to-secondary/10",
                    "border border-primary/20"
                  )}>
                    {count} 个
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full font-medium",
                    "bg-gradient-to-r from-primary/20 to-secondary/20",
                    "text-primary",
                    "shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                  )}>
                    {percentage}%
                  </span>
                </span>
              </div>

              {/* Progress bar - Premium style */}
              <div className={cn(
                "relative h-3 rounded-full overflow-hidden",
                "glass-card",
                "group-hover/bar:shadow-[0_0_20px_rgba(0,245,255,0.2)]",
                "transition-all duration-300"
              )}>
                {/* Background glow */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
                )} />

                {/* Gradient progress bar */}
                <div
                  className={cn(
                    "relative h-full rounded-full overflow-hidden",
                    "bg-gradient-to-r",
                    config.fromColor,
                    config.toColor,
                    "transition-all duration-700 ease-out",
                    "group-hover/bar:shadow-[0_0_20px_currentColor]",
                    "after:absolute after:inset-0 after:bg-gradient-to-r",
                    `after:from-white/30 after:via-transparent after:to-transparent`,
                    "after:animate-shimmer"
                  )}
                  style={{
                    width: `${percentage}%`,
                    boxShadow: `0 0 20px ${config.glowColor}`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 环形图 - Premium glass style */}
      <div className={cn(
        "relative w-56 h-56 mx-auto",
        "group/donut"
      )}>
        {/* Outer glow */}
        <div className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r from-primary/10 to-secondary/10",
          "blur-2xl opacity-50 group-hover/donut:opacity-75 transition-opacity duration-500"
        )} />

        <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="12"
            className="stroke-white/5"
          />

          {/* Gradient segments */}
          {emotionData.map(({ type, percentage }, index) => {
            const config = emotionConfig[type]
            const offset = emotionData
              .slice(0, index)
              .reduce((sum, d) => sum + d.percentage, 0)
            const dashArray = `${percentage} ${100 - percentage}`
            const dashOffset = -offset

            // Create gradient ID
            const gradientId = `gradient-${type}`

            return (
              <g key={type}>
                {/* Gradient definition */}
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={cn(`stop-color ${config.fromColor.replace("from-", "text-")}`)} stopOpacity="1" />
                    <stop offset="100%" className={cn(`stop-color ${config.toColor.replace("to-", "text-")}`)} stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Circle segment with gradient */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="12"
                  stroke={`url(#${gradientId})`}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className={cn(
                    "transition-all duration-700 ease-out",
                    "hover:opacity-100 cursor-pointer",
                    "filter drop-shadow-[0_0_8px_currentColor]"
                  )}
                  style={{
                    opacity: 0.85,
                    color: config.glowColor
                  }}
                />
              </g>
            )
          })}
        </svg>

        {/* Center content */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center"
        )}>
          <div className={cn(
            "relative z-10 text-center",
            "glass-card rounded-2xl px-6 py-3",
            "hover:scale-110 transition-transform duration-300"
          )}>
            <div className={cn(
              "text-3xl font-bold",
              "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            )}>
              {totalDreams}
            </div>
            <div className="text-xs text-muted-foreground">梦境</div>
          </div>
        </div>
      </div>

      {/* 图例 - Premium glass style */}
      <div className={cn(
        "flex flex-wrap justify-center gap-3"
      )}>
        {emotionData.map(({ type, count }) => {
          const config = emotionConfig[type]
          return (
            <div
              key={type}
              className={cn(
                "group/legend relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl",
                "glass-card",
                "hover:scale-105",
                "hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]",
                "transition-all duration-300 ease-out",
                "cursor-pointer"
              )}
            >
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover/legend:opacity-100",
                `bg-gradient-to-r ${config.fromColor} ${config.toColor}`,
                "blur-md transition-opacity duration-300"
              )} />

              <span className={cn(
                "relative z-10 text-base",
                "transition-transform duration-300 group-hover/legend:rotate-12"
              )}>
                {config.icon}
              </span>
              <span className={cn(
                "relative z-10 text-sm font-medium",
                "text-foreground"
              )}>
                {config.label}
              </span>
              <span className={cn(
                "relative z-10 text-xs",
                "px-1.5 py-0.5 rounded-full",
                "bg-gradient-to-r from-primary/20 to-secondary/20",
                "text-primary font-medium"
              )}>
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
