"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

// 情感类型配置 - Premium gradient colors with actual color values for SVG
const emotionConfig: Record<string, {
  icon: string
  label: string
  fromColor: string
  toColor: string
  fromColorRgb: string
  toColorRgb: string
  glowColor: string
}> = {
  "平静": {
    icon: "🌙",
    label: "平静",
    fromColor: "from-blue-500",
    toColor: "to-cyan-500",
    fromColorRgb: "#3b82f6",
    toColorRgb: "#06b6d4",
    glowColor: "rgba(59, 130, 246, 0.5)"
  },
  "愉悦": {
    icon: "✨",
    label: "愉悦",
    fromColor: "from-purple-500",
    toColor: "to-pink-500",
    fromColorRgb: "#a855f7",
    toColorRgb: "#ec4899",
    glowColor: "rgba(168, 85, 247, 0.5)"
  },
  "忧郁": {
    icon: "🌫️",
    label: "忧郁",
    fromColor: "from-purple-400",
    toColor: "to-violet-500",
    fromColorRgb: "#c084fc",
    toColorRgb: "#8b5cf6",
    glowColor: "rgba(147, 51, 234, 0.5)"
  },
  "悲伤": {
    icon: "💧",
    label: "悲伤",
    fromColor: "from-blue-400",
    toColor: "to-indigo-500",
    fromColorRgb: "#60a5fa",
    toColorRgb: "#6366f1",
    glowColor: "rgba(96, 165, 250, 0.5)"
  },
  "恐惧": {
    icon: "👁️",
    label: "恐惧",
    fromColor: "from-red-500",
    toColor: "to-orange-500",
    fromColorRgb: "#ef4444",
    toColorRgb: "#f97316",
    glowColor: "rgba(239, 68, 68, 0.5)"
  },
  "兴奋": {
    icon: "🚀",
    label: "兴奋",
    fromColor: "from-yellow-500",
    toColor: "to-amber-500",
    fromColorRgb: "#eab308",
    toColorRgb: "#f59e0b",
    glowColor: "rgba(234, 179, 8, 0.5)"
  },
  "焦虑": {
    icon: "⚡",
    label: "焦虑",
    fromColor: "from-orange-500",
    toColor: "to-red-500",
    fromColorRgb: "#f97316",
    toColorRgb: "#ef4444",
    glowColor: "rgba(249, 115, 22, 0.5)"
  },
}

export function EmotionChart({ dreams }: EmotionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hoveredType, setHoveredType] = useState<string | null>(null)

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
      {/* 标题 - Premium style（移除闪烁动画） */}
      <div className={cn(
        "text-center space-y-2"
      )}>
        <h3 className={cn(
          "text-xl font-bold",
          "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
        )}>
          情感分布统计
        </h3>
        <p className={cn(
          "text-sm text-muted-foreground",
          "flex items-center justify-center gap-2"
        )}>
          <span className={cn(
            "inline-flex items-center justify-center w-2 h-2 rounded-full",
            "bg-primary"
          )} />
          共 {totalDreams} 个梦境
        </p>
      </div>

      {/* 水平条形图 - Premium glass style with Framer Motion */}
      <div className="space-y-4">
        {emotionData.map(({ type, count, percentage }, index) => {
          const config = emotionConfig[type]
          return (
            <motion.div
              key={type}
              className={cn(
                "group/bar relative space-y-2"
              )}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Label row */}
              <div className={cn(
                "flex items-center justify-between text-sm"
              )}>
                <motion.span
                  className={cn(
                    "flex items-center gap-2",
                    "cursor-pointer"
                  )}
                  whileHover={{ x: 5, transition: { type: "spring", stiffness: 300 } }}
                >
                  <motion.span
                    className={cn("text-lg")}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    {config.icon}
                  </motion.span>
                  <span className={cn(
                    "font-medium",
                    "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  )}>
                    {config.label}
                  </span>
                </motion.span>
                <span className={cn(
                  "flex items-center gap-2",
                  "text-foreground/60 text-xs"
                )}>
                  <motion.span
                    className={cn(
                      "px-2 py-0.5 rounded-full",
                      "bg-gradient-to-r from-primary/10 to-secondary/10",
                      "border border-primary/20 font-medium"
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    {count} 个
                  </motion.span>
                  <motion.span
                    className={cn(
                      "px-2 py-0.5 rounded-full font-medium",
                      "bg-gradient-to-r from-primary/20 to-secondary/20",
                      "text-primary",
                      "shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    {percentage}%
                  </motion.span>
                </span>
              </div>

              {/* Progress bar - Premium style（移除闪烁动画） */}
              <div className={cn(
                "relative h-3 rounded-full overflow-hidden",
                "glass-card backdrop-blur-sm border border-primary/10",
                "group-hover/bar:shadow-[0_0_20px_rgba(0,245,255,0.2)]",
                "transition-all duration-300"
              )}>
                {/* Background glow */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"
                )} />

                {/* Gradient progress bar with Framer Motion */}
                <motion.div
                  className={cn(
                    "relative h-full rounded-full overflow-hidden",
                    "bg-gradient-to-r",
                    config.fromColor,
                    config.toColor
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  style={{
                    boxShadow: `0 0 20px ${config.glowColor}`
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 环形图 - 意识流梦幻版 */}
      <div className="relative flex justify-center py-8">
        {/* 静态背景光晕 - 移除闪烁 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-cyan-400/20 blur-3xl" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary/25 via-secondary/25 to-purple-400/25 blur-2xl" />
        </div>

        <motion.div
          ref={chartRef}
          className={cn(
            "relative w-72 h-72",
            "group/donut"
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onMouseLeave={() => setHoveredType(null)}
        >
          <svg className="relative w-full h-full -rotate-90" viewBox="0 0 200 200">
            <defs>
              {emotionData.map(({ type }) => {
                const config = emotionConfig[type]
                const gradientId = `gradient-${type}`
                const glowId = `glow-${type}`
                return (
                  <g key={gradientId}>
                    <radialGradient id={`glow-grad-${type}`}>
                      <stop offset="0%" stopColor={config.fromColorRgb} stopOpacity="1" />
                      <stop offset="100%" stopColor={config.toColorRgb} stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={config.fromColorRgb} stopOpacity="1" />
                      <stop offset="50%" stopColor={config.toColorRgb} stopOpacity="1" />
                      <stop offset="100%" stopColor={config.fromColorRgb} stopOpacity="1" />
                    </linearGradient>
                    <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    </filter>
                  </g>
                )
              })}
            </defs>

            {/* 背景圆环 - 模糊光晕 */}
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              strokeWidth="16"
              stroke="rgba(255,255,255,0.06)"
              style={{ filter: "blur(1px)" }}
            />

            {/* 渐变段 - 流动效果 */}
            {emotionData.map(({ type, percentage }, index) => {
              const config = emotionConfig[type]
              const circumference = 2 * Math.PI * 72

              // 计算每段的实际长度（只在段之间留小间隙）
              const gapSize = 2 // 段之间的间隙大小
              const totalGaps = emotionData.length > 1 ? emotionData.length : 0
              const totalGapLength = totalGaps * gapSize
              const usableCircumference = circumference - totalGapLength

              const segmentLength = (percentage / 100) * usableCircumference
              const gapLength = circumference - segmentLength

              const previousPercentage = emotionData
                .slice(0, index)
                .reduce((sum, d) => sum + d.percentage, 0)

              // 计算偏移量时考虑之前的间隙
              const previousGaps = index > 0 ? index * gapSize : 0
              const offsetLength = (previousPercentage / 100) * usableCircumference + previousGaps

              const isHovered = hoveredType === type
              const isDimmed = hoveredType !== null && hoveredType !== type

              return (
                <g key={type}>
                  {/* 外层光晕 - 移除闪烁动画 */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    strokeWidth="24"
                    stroke={`url(#glow-grad-${type})`}
                    strokeDasharray={`${segmentLength} ${gapLength}`}
                    strokeDashoffset={-offsetLength}
                    strokeLinecap="round"
                    style={{
                      filter: "blur(8px)",
                      opacity: isDimmed ? 0.05 : (isHovered ? 0.3 : 0.15),
                    }}
                    className="pointer-events-none"
                  />

                  {/* 主圆环 - 移除闪烁动画 */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    strokeWidth="16"
                    stroke={`url(#gradient-${type})`}
                    strokeDasharray={`${segmentLength} ${gapLength}`}
                    strokeDashoffset={-offsetLength}
                    strokeLinecap="butt"
                    initial={{ strokeDashoffset: -offsetLength + segmentLength + gapSize }}
                    animate={{
                      strokeDashoffset: -offsetLength,
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1.5, delay: 0.2 + index * 0.1, ease: "easeOut" },
                    }}
                    style={{
                      filter: isHovered ? `url(#glow-${type})` : "blur(0.5px)",
                      opacity: isDimmed ? 0.2 : 0.9,
                    }}
                    onMouseEnter={() => setHoveredType(type)}
                    whileHover={{
                      strokeWidth: 20,
                      scale: 1.02,
                      transformOrigin: "center",
                    }}
                    className="cursor-pointer"
                  />
                </g>
              )
            })}
          </svg>

          {/* 中心内容 - 梦幻风格（移除闪烁动画） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {hoveredType ? (
                <motion.div
                  key="hover"
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="text-5xl mb-2 drop-shadow-2xl"
                    whileHover={{ scale: 1.1 }}
                    style={{
                      filter: "drop-shadow(0 0 25px rgba(255,255,255,0.6))"
                    }}
                  >
                    {emotionConfig[hoveredType].icon}
                  </motion.div>
                  <div className="text-lg font-semibold text-white/95 tracking-wide">
                    {emotionConfig[hoveredType].label}
                  </div>
                  <div className="text-sm text-white/50 mt-1 font-light">
                    {emotionData.find(d => d.type === hoveredType)?.percentage || 0}%
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="text-6xl font-bold text-white mb-2"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,1) 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 25px rgba(255,255,255,0.4))"
                    }}
                  >
                    {totalDreams}
                  </div>
                  <div className="text-sm text-white/40 tracking-widest font-light">
                    梦境总数
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 图例 - 意识流梦幻版（移除闪烁动画） */}
      <motion.div
        className={cn(
          "flex flex-wrap justify-center gap-3"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {emotionData.map(({ type, count, percentage }, index) => {
          const config = emotionConfig[type]
          return (
            <motion.div
              key={type}
              className={cn(
                "group/legend relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full",
                "cursor-pointer overflow-hidden"
              )}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.6 + index * 0.08,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{
                scale: 1.08,
                y: -3,
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredType(type)}
              style={{
                background: `linear-gradient(135deg, ${config.fromColorRgb}15 0%, ${config.toColorRgb}10 100%)`,
                border: `1px solid ${config.fromColorRgb}30`,
                boxShadow: `0 0 ${hoveredType === type ? '25px' : '10px'} ${config.fromColorRgb}40`,
              }}
            >
              <motion.span
                className="text-lg relative z-10"
                whileHover={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5 }}
              >
                {config.icon}
              </motion.span>
              <span className={cn(
                "text-sm font-medium relative z-10",
                "text-white/90 tracking-wide"
              )}>
                {config.label}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full relative z-10",
                  "text-white/80"
                )}
                style={{
                  background: `linear-gradient(135deg, ${config.fromColorRgb}30 0%, ${config.toColorRgb}20 100%)`,
                }}
              >
                {percentage}%
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
