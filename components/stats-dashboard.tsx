"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fetchDreams, type Dream } from "@/lib/api-client"
import { EmotionChart } from "./emotion-chart"
import { Calendar, TrendingUp, Moon, Sparkles, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsData {
  totalDreams: number
  thisMonth: number
  thisWeek: number
  mostCommonEmotion: string
  averageDreamLength: number
  dreams: Dream[]
}

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const dreams = await fetchDreams(1)

        if (!dreams || dreams.length === 0) {
          setStats({
            totalDreams: 0,
            thisMonth: 0,
            thisWeek: 0,
            mostCommonEmotion: "无",
            averageDreamLength: 0,
            dreams: []
          })
          setLoading(false)
          return
        }

        // 计算统计数据
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisWeek = new Date(now.setDate(now.getDate() - 7))

        const thisMonthDreams = dreams.filter(d => new Date(d.created_at) >= thisMonth).length
        const thisWeekDreams = dreams.filter(d => new Date(d.created_at) >= thisWeek).length

        // 计算最常见情感
        const emotionCounts: Record<string, number> = {}
        dreams.forEach(dream => {
          const emotion = dream.emotion?.type || "未知"
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
        })

        const mostCommonEmotion = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "无"

        // 计算平均梦境长度
        const avgLength = dreams.reduce((sum, dream) => sum + dream.content.length, 0) / dreams.length

        setStats({
          totalDreams: dreams.length,
          thisMonth: thisMonthDreams,
          thisWeek: thisWeekDreams,
          mostCommonEmotion,
          averageDreamLength: Math.round(avgLength),
          dreams
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          {/* 静态光晕 */}
          <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-primary/30 to-secondary/30" />
          {/* 旋转环 */}
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-secondary rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* 核心脉冲 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40" />
          </div>
        </div>
      </div>
    )
  }

  if (!stats || stats.totalDreams === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          className="inline-flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 静态光晕 */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
              <Moon className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              还没有梦境数据
            </h3>
            <p className="text-muted-foreground">开始记录你的梦境，解锁统计功能</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // 统计卡片数据
  const statCards = [
    {
      icon: Sparkles,
      label: "总梦境数",
      value: stats.totalDreams,
      color: "from-primary/20 to-secondary/20",
      borderColor: "border-primary/30",
      textColor: "text-primary"
    },
    {
      icon: Calendar,
      label: "本月记录",
      value: stats.thisMonth,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400"
    },
    {
      icon: Activity,
      label: "本周记录",
      value: stats.thisWeek,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400"
    },
    {
      icon: TrendingUp,
      label: "平均字数",
      value: `${stats.averageDreamLength}`,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400"
    }
  ]

  return (
    <div className="space-y-8">
      {/* 统计卡片网格 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 边框渐变 - 移除闪烁动画 */}
              <div className={cn(
                "absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                "bg-gradient-to-r from-primary via-secondary to-primary",
                "bg-[length:200%_auto] blur-md"
              )} />

              {/* 卡片主体 - 增强毛玻璃效果 */}
              <div className={cn(
                "relative glass-card rounded-2xl p-6",
                "border backdrop-blur-xl",
                card.borderColor,
                "overflow-hidden",
                "bg-gradient-to-br from-white/10 to-white/5"
              )}>
                {/* 顶部光泽层 */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* 静态背景光晕 */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${card.color.replace('/20', '/20')}, transparent 70%)`
                  }}
                />

                <div className="relative">
                  {/* 图标容器 - 增强质感 */}
                  <div
                    className={cn(
                      "p-4 rounded-2xl bg-gradient-to-br mb-4 relative overflow-hidden",
                      card.color
                    )}
                  >
                    {/* 图标内部光泽 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                    <Icon className={cn("w-7 h-7 relative z-10", card.textColor)} />
                  </div>

                  {/* 标签 */}
                  <p className="text-sm text-foreground/70 mb-2 font-medium">
                    {card.label}
                  </p>

                  {/* 数值 - 增强阴影和质感 */}
                  <motion.p
                    className={cn("text-4xl font-bold", card.textColor)}
                    style={{
                      textShadow: `0 0 30px ${card.textColor === 'text-primary' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(236, 72, 153, 0.5)'}, 0 4px 12px rgba(0,0,0,0.3)`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
                  >
                    {card.value}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* 主要情感 */}
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* 外层光晕 - 移除闪烁 */}
        <div className="absolute -inset-[2px] rounded-2xl opacity-30 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]" />
        <div className="relative glass-card rounded-2xl p-6 border border-primary/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
          {/* 顶部光泽层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <Moon className="w-5 h-5 text-primary relative z-10" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">主导情感</h3>
                <p className="text-sm text-foreground/60">你梦境中最常出现的情感</p>
              </div>
            </div>
            <div className="text-center py-6">
              <motion.div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-md relative overflow-hidden group/emotion"
                whileHover={{ scale: 1.05, y: -2, transition: { type: "spring", stiffness: 400 } }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 内部光泽 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover/emotion:opacity-100 transition-opacity duration-300" />

                <motion.span
                  className="text-3xl relative z-10"
                  whileHover={{ rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
                >
                  💭
                </motion.span>
                <span className="text-xl font-bold text-primary relative z-10" style={{ textShadow: "0 0 20px rgba(6, 182, 212, 0.6), 0 4px 12px rgba(0,0,0,0.3)" }}>
                  {stats.mostCommonEmotion}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 情感分布图表 */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="absolute -inset-[2px] rounded-2xl opacity-25 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]" />
        <div className="relative glass-card rounded-2xl p-8 border border-primary/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
          {/* 顶部光泽层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-30" />
          <div className="relative">
            <EmotionChart dreams={stats.dreams} />
          </div>
        </div>
      </motion.div>

      {/* 最近梦境趋势 */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="absolute -inset-[2px] rounded-2xl opacity-25 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]" />
        <div className="relative glass-card rounded-2xl p-6 border border-primary/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
          {/* 顶部光泽层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-30" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <TrendingUp className="w-5 h-5 text-primary relative z-10" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">最近记录</h3>
                <p className="text-sm text-foreground/60">最新的 5 个梦境</p>
              </div>
            </div>

            <div className="space-y-4">
              {stats.dreams.slice(0, 5).map((dream, index) => (
                <motion.a
                  key={dream.id}
                  href={`/dreams/${dream.id}`}
                  className={cn(
                    "block p-4 rounded-xl border border-primary/10 backdrop-blur-sm relative overflow-hidden",
                    "hover:border-primary/30 bg-gradient-to-br from-white/5 to-transparent",
                    "transition-all duration-300 group"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 8, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 顶部光泽 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 悬停光晕扫过 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/60 mb-1 font-medium">
                        {new Date(dream.created_at).toLocaleDateString("zh-CN")}
                      </p>
                      <p className="text-foreground line-clamp-2 group-hover:text-primary transition-colors" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        {dream.content.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {dream.emotion && (
                        <motion.span
                          className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium backdrop-blur-sm border border-primary/20"
                          whileHover={{ scale: 1.1 }}
                          style={{ textShadow: "0 0 10px rgba(6, 182, 212, 0.3)" }}
                        >
                          {dream.emotion.type}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 梦境活跃度热力图 */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="absolute -inset-[2px] rounded-2xl opacity-25 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]" />
        <div className="relative glass-card rounded-2xl p-6 border border-primary/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
          {/* 顶部光泽层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-30" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <Activity className="w-5 h-5 text-primary relative z-10" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">记录活跃度</h3>
                <p className="text-sm text-foreground/60">过去 30 天的梦境记录频率</p>
              </div>
            </div>

            <div className="flex gap-1 flex-wrap justify-center p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split('T')[0]

                // 检查这天是否有梦境
                const hasDream = stats.dreams.some(dream =>
                  new Date(dream.created_at).toISOString().split('T')[0] === dateStr
                )

                // 计算这天的梦境数量
                const dreamCount = stats.dreams.filter(dream =>
                  new Date(dream.created_at).toISOString().split('T')[0] === dateStr
                ).length

                return (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-sm transition-all duration-300 cursor-pointer relative overflow-hidden",
                      hasDream
                        ? dreamCount > 2
                          ? "bg-gradient-to-br from-primary to-secondary shadow-[0_0_15px_rgba(0,245,255,0.7)]"
                          : dreamCount > 1
                          ? "bg-gradient-to-br from-primary/70 to-secondary/70 shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                          : "bg-gradient-to-br from-primary/40 to-secondary/40 shadow-[0_0_6px_rgba(0,245,255,0.3)]"
                        : "bg-white/5"
                    )}
                    title={`${dateStr}: ${dreamCount} 个梦境`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + i * 0.02, type: "spring" }}
                    whileHover={{ scale: 1.6, y: -3, zIndex: 10 }}
                    whileTap={{ scale: 1.3 }}
                  >
                    {/* 方块内部光泽 */}
                    {hasDream && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-foreground/60">
              <span className="font-medium">少</span>
              <div className="flex gap-1">
                <motion.div
                  className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary/40 to-secondary/40 shadow-[0_0_6px_rgba(0,245,255,0.3)]"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary/70 to-secondary/70 shadow-[0_0_8px_rgba(0,245,255,0.4)]"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary to-secondary shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <span className="font-medium">多</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
