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

              {/* Progress bar - Premium style with animation */}
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
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      "from-white/30 via-transparent to-white/30"
                    )}
                    animate={{
                      x: ["-100%", "200%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 环形图 - Premium with enhanced texture */}
      <motion.div
        ref={chartRef}
        className={cn(
          "relative w-72 h-72 mx-auto",
          "group/donut"
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onMouseLeave={() => setHoveredType(null)}
      >
        {/* 多层光晕效果 */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-2xl"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1.05, 1, 1.05]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>

        <svg className="relative w-full h-full -rotate-90" viewBox="0 0 200 200">
          <defs>
            {/* Create gradients for each emotion */}
            {emotionData.map(({ type }) => {
              const config = emotionConfig[type]
              const gradientId = `gradient-${type}`
              return (
                <g key={gradientId}>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={config.fromColorRgb} stopOpacity="1" />
                    <stop offset="100%" stopColor={config.toColorRgb} stopOpacity="1" />
                  </linearGradient>
                  {/* Shadow filter */}
                  <filter id={`shadow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.5" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </g>
              )
            })}
          </defs>

          {/* Background circle with gradient */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            strokeWidth="18"
            stroke="url(#bg-gradient)"
          />
          <defs>
            <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>

          {/* Gradient segments */}
          {emotionData.map(({ type, percentage }, index) => {
            const config = emotionConfig[type]
            const circumference = 2 * Math.PI * 75 // ≈ 471.2
            const segmentLength = (percentage / 100) * circumference
            const gapLength = circumference - segmentLength

            // Calculate offset from previous segments
            const previousPercentage = emotionData
              .slice(0, index)
              .reduce((sum, d) => sum + d.percentage, 0)
            const offsetLength = (previousPercentage / 100) * circumference

            const isHovered = hoveredType === type
            const isDimmed = hoveredType !== null && hoveredType !== type

            return (
              <g key={type}>
                {/* Circle segment with enhanced effects */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  strokeWidth="18"
                  stroke={`url(#gradient-${type})`}
                  strokeDasharray={`${segmentLength} ${gapLength}`}
                  strokeDashoffset={-offsetLength}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: -offsetLength + segmentLength }}
                  animate={{ strokeDashoffset: -offsetLength }}
                  transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                  style={{
                    opacity: isDimmed ? 0.15 : 0.95,
                    filter: isHovered ? `url(#shadow-${type}) drop-shadow(0 0 12px ${config.glowColor})` : `drop-shadow(0 0 6px ${config.glowColor})`
                  }}
                  onMouseEnter={() => setHoveredType(type)}
                  whileHover={{
                    strokeWidth: 22,
                    scale: 1.02,
                    transformOrigin: "center"
                  }}
                  exit={{
                    opacity: 0.15
                  }}
                  className="cursor-pointer transition-all duration-500"
                />

                {/* Hover highlight ring */}
                {isHovered && (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    strokeWidth="2"
                    stroke={config.fromColorRgb}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="pointer-events-none"
                  />
                )}
              </g>
            )
          })}
        </svg>

        {/* Center content with glass effect */}
        <motion.div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className={cn(
              "relative z-10 text-center",
              "rounded-2xl px-8 py-6",
              "backdrop-blur-2xl border border-white/10",
              "bg-gradient-to-br from-white/20 via-white/10 to-white/5",
              "shadow-2xl"
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            }}
          >
            {/* 内部光泽层 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50" />

            <motion.div
              className={cn(
                "text-5xl font-bold relative z-10",
                "bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
              )}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% auto",
                filter: "drop-shadow(0 2px 8px rgba(6, 182, 212, 0.5))"
              }}
            >
              {totalDreams}
            </motion.div>
            <div className="text-sm text-foreground/70 mt-2 font-medium relative z-10">梦境总数</div>

            {/* Hover info with animation */}
            <AnimatePresence mode="wait">
              {hoveredType && (
                <motion.div
                  className="mt-4 pt-4 border-t border-white/20 relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="text-3xl mb-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 1 }}
                  >
                    {emotionConfig[hoveredType].icon}
                  </motion.div>
                  <div className="text-sm text-foreground/80 font-semibold">{emotionConfig[hoveredType].label}</div>
                  <div className="text-xs text-foreground/60 mt-1">
                    {emotionData.find(d => d.type === hoveredType)?.count || 0} 个梦境
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 图例 - Premium glass style with Framer Motion */}
      <motion.div
        className={cn(
          "flex flex-wrap justify-center gap-3"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        {emotionData.map(({ type, count }, index) => {
          const config = emotionConfig[type]
          return (
            <motion.div
              key={type}
              className={cn(
                "group/legend relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl",
                "glass-card backdrop-blur-sm border border-primary/10",
                "cursor-pointer overflow-hidden"
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.08, type: "spring" }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-0",
                  `bg-gradient-to-r ${config.fromColor} ${config.toColor}`,
                  "blur-md"
                )}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />

              <motion.span
                className={cn(
                  "relative z-10 text-base"
                )}
                whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.4 } }}
              >
                {config.icon}
              </motion.span>
              <span className={cn(
                "relative z-10 text-sm font-medium",
                "text-foreground"
              )}>
                {config.label}
              </span>
              <motion.span
                className={cn(
                  "relative z-10 text-xs",
                  "px-1.5 py-0.5 rounded-full",
                  "bg-gradient-to-r from-primary/20 to-secondary/20",
                  "text-primary font-medium"
                )}
                whileHover={{ scale: 1.1 }}
              >
                {count}
              </motion.span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
