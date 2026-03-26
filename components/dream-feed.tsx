"use client"

import { DreamCard } from "./dream-card"
import { useState, useEffect, useMemo } from "react"
import { fetchDreams, type Dream } from "@/lib/api-client"
import { Search, Sparkles, Filter, X, ChevronLeft, ChevronRight, Star, SparkleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// 情感类型映射 - 更准确的情感分类
const emotionMoodMap: Record<string, string> = {
  "平静": "peaceful",
  "愉悦": "mystical",
  "兴奋": "adventurous",
  "悲伤": "emotional",
  "恐惧": "surreal",
  "焦虑": "surreal",
  "忧郁": "emotional",
}

// 情感过滤器配置
const emotionFilters = [
  { key: "all", label: "全部", icon: "✨", color: "from-primary/20 to-secondary/20" },
  { key: "平静", label: "平静", icon: "🌙", color: "from-blue-500/20 to-purple-500/20" },
  { key: "愉悦", label: "愉悦", icon: "✨", color: "from-primary/20 to-secondary/20" },
  { key: "兴奋", label: "兴奋", icon: "🚀", color: "from-yellow-500/20 to-orange-500/20" },
  { key: "悲伤", label: "悲伤", icon: "💧", color: "from-blue-400/20 to-cyan-500/20" },
  { key: "焦虑", label: "焦虑", icon: "⚡", color: "from-orange-500/20 to-red-500/20" },
  { key: "忧郁", label: "忧郁", icon: "🌫️", color: "from-purple-500/20 to-pink-500/20" },
]

// 每页显示的梦境数量
const DREAMS_PER_PAGE = 6

interface FeedDream {
  id: number
  title: string
  date: string
  mood: string
  summary: string
  emotionType: string
}

export function DreamFeed() {
  const [dreams, setDreams] = useState<FeedDream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // 过滤和搜索梦境
  const filteredDreams = useMemo(() => {
    return dreams.filter(dream => {
      // 情感过滤
      if (selectedEmotion !== "all" && dream.emotionType !== selectedEmotion) {
        return false
      }
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          dream.title.toLowerCase().includes(query) ||
          dream.summary.toLowerCase().includes(query) ||
          dream.emotionType.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [dreams, searchQuery, selectedEmotion])

  // 分页数据
  const totalPages = Math.ceil(filteredDreams.length / DREAMS_PER_PAGE)
  const paginatedDreams = useMemo(() => {
    const startIndex = (currentPage - 1) * DREAMS_PER_PAGE
    const endIndex = startIndex + DREAMS_PER_PAGE
    return filteredDreams.slice(startIndex, endIndex)
  }, [filteredDreams, currentPage])

  // 当筛选条件改变时重置页码
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedEmotion])

  useEffect(() => {
    async function loadDreams() {
      try {
        const dreams = await fetchDreams(1)

        if (!dreams || dreams.length === 0) {
          setDreams([])
          setLoading(false)
          return
        }

        // 转换 API 数据为组件所需格式
        const feedDreams: FeedDream[] = dreams.map((dream: Dream) => {
          const emotionType = dream.emotion?.type || "平静"
          const mood = emotionMoodMap[emotionType] || "mystical"
          // 优先使用标题，否则截取内容
          const title = dream.title || dream.content.slice(0, 30) + (dream.content.length > 30 ? "..." : "")
          // 生成摘要
          const summary = dream.content.slice(0, 120) + (dream.content.length > 120 ? "..." : "")
          // 格式化日期
          const date = new Date(dream.created_at).toISOString().split('T')[0]

          return {
            id: dream.id,
            title,
            date,
            mood: mood as any,
            summary,
            emotionType
          }
        })
        setDreams(feedDreams.reverse()) // 最新的在前
        setError(null)
      } catch (error) {
        console.error("Failed to fetch dreams:", error)
        setError("无法加载梦境，请稍后重试")
      } finally {
        setLoading(false)
      }
    }
    loadDreams()
  }, [])

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery("")
  }

  // 清除情感筛选
  const clearEmotionFilter = () => {
    setSelectedEmotion("all")
  }

  // 处理梦境删除
  const handleDreamDelete = (deletedId: number) => {
    setDreams(prev => prev.filter(dream => dream.id !== deletedId))
  }

  return (
    <section id="archive" className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            梦境档案
          </span>
        </h2>
        <p className="text-muted-foreground">
          漂浮在虚空中的星云碎片，每一个都承载着独特的梦境
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-primary/60" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索梦境内容、关键词或情感..."
            className={cn(
              "w-full pl-12 pr-12 py-4 rounded-2xl",
              "glass-card border border-primary/20",
              "bg-nebula-deep/50 text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
              "transition-all duration-300"
            )}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Emotion Filter Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Filter className="w-4 h-4" />
            <span>情感筛选</span>
            <span className="text-xs text-primary/60">
              {selectedEmotion !== "all" ? `(已选: ${selectedEmotion})` : ""}
            </span>
          </motion.button>
          {selectedEmotion !== "all" && (
            <motion.button
              onClick={clearEmotionFilter}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg hover:bg-primary/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              清除筛选
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 p-5 rounded-2xl glass-card border border-primary/15"
            >
            {emotionFilters.map((filter, index) => {
              const isSelected = selectedEmotion === filter.key
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setSelectedEmotion(filter.key)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl border overflow-hidden",
                    "flex items-center gap-2 text-sm font-medium",
                    isSelected
                      ? "bg-gradient-to-r from-primary/25 to-secondary/25 border-primary/40"
                      : "bg-white/5 border-white/10 hover:border-primary/25 hover:bg-white/10"
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {/* 激活状态微光 */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: "radial-gradient(circle at center, rgba(0,245,255,0.15) 0%, transparent 70%)",
                      }}
                    />
                  )}
                  {/* 图标 */}
                  <motion.span
                    animate={isSelected ? {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.15, 1],
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-base"
                  >
                    {filter.icon}
                  </motion.span>
                  {/* 标签 */}
                  <span className={cn(
                    "relative z-10",
                    isSelected ? "text-primary" : "text-white/70"
                  )}>
                    {filter.label}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Summary */}
      {!loading && !error && dreams.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-1 text-primary/60" />
            找到 <span className="text-foreground font-semibold">{filteredDreams.length}</span> 个梦境
            {searchQuery && ` · 搜索: "${searchQuery}"`}
            {selectedEmotion !== "all" && ` · 情感: ${selectedEmotion}`}
            {totalPages > 1 && (
              <span className="ml-2">
                · 第 <span className="text-foreground font-semibold">{currentPage}</span> / {totalPages} 页
              </span>
            )}
          </p>
        </div>
      )}

      {/* Dream Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground">正在从星云中收集梦境...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                // Reload dreams
                fetchDreams(1).then(dreams => {
                  if (dreams) {
                    window.location.reload()
                  }
                })
              }}
              className="px-6 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      ) : dreams.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary/60" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">还没有梦境记录</h3>
              <p className="text-muted-foreground">开始记录你的第一个梦境吧</p>
            </div>
          </div>
        </div>
      ) : filteredDreams.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-muted-foreground">没有找到匹配的梦境</p>
            {(searchQuery || selectedEmotion !== "all") && (
              <button
                onClick={() => {
                  clearSearch()
                  clearEmotionFilter()
                }}
                className="px-6 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-foreground transition-colors"
              >
                清除筛选条件
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <DreamCard
                    id={dream.id}
                    title={dream.title}
                    date={dream.date}
                    mood={dream.mood}
                    summary={dream.summary}
                    index={index}
                    onDelete={handleDreamDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls - 梦幻毛玻璃翻页 */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl overflow-hidden">
                {/* 毛玻璃背景 */}
                <div className="absolute inset-0 glass-card" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />

                {/* 上一页 */}
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "relative z-10 p-2.5 rounded-xl",
                    "disabled:opacity-25 disabled:cursor-not-allowed",
                    "bg-primary/10 hover:bg-primary/15",
                    "border border-primary/20 hover:border-primary/30",
                    "transition-all duration-300"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 15
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-primary/80" />
                </motion.button>

                {/* 页码 */}
                <div className="flex items-center gap-2 z-10">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    const isActive = pageNum === currentPage

                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "relative w-11 h-11 rounded-xl overflow-hidden",
                          "border transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-br from-primary/30 to-secondary/30 border-primary/30"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={isActive ? {
                          y: [0, -2, 0],
                        } : {}}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                          y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        {/* 激活状态微光 */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            animate={{
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            style={{
                              background: "radial-gradient(circle at center, rgba(0,245,255,0.2) 0%, transparent 70%)",
                            }}
                          />
                        )}
                        <span className={cn(
                          "relative z-10 text-sm font-semibold",
                          isActive ? "text-primary" : "text-white/60"
                        )}>
                          {pageNum}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* 下一页 */}
                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "relative z-10 p-2.5 rounded-xl",
                    "disabled:opacity-25 disabled:cursor-not-allowed",
                    "bg-primary/10 hover:bg-primary/15",
                    "border border-primary/20 hover:border-primary/30",
                    "transition-all duration-300"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 15
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-primary/80" />
                </motion.button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
