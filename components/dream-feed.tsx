"use client"

import { DreamCard } from "./dream-card"
import { useState, useEffect } from "react"
import { fetchDreams, type Dream } from "@/lib/api-client"

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

interface FeedDream {
  id: number
  title: string
  date: string
  mood: string
  summary: string
}

export function DreamFeed() {
  const [dreams, setDreams] = useState<FeedDream[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDreams() {
      try {
        const dreams = await fetchDreams(1)

        console.log('Dreams loaded:', dreams.map(d => ({ id: d.id, content: d.content.slice(0, 30) })))

        // 转换 API 数据为组件所需格式
        const feedDreams: FeedDream[] = dreams.map((dream: Dream) => {
          const emotionType = dream.emotion?.type || "平静"
          const mood = emotionMoodMap[emotionType] || "mystical"
          // 生成标题：取前20个字符
          const title = dream.content.slice(0, 20) + (dream.content.length > 20 ? "..." : "")
          // 生成摘要
          const summary = dream.content.slice(0, 100) + (dream.content.length > 100 ? "..." : "")
          // 格式化日期
          const date = new Date(dream.created_at).toISOString().split('T')[0]

          return {
            id: dream.id,
            title,
            date,
            mood: mood as any,
            summary
          }
        })
        setDreams(feedDreams.reverse()) // 最新的在前
      } catch (error) {
        console.error("Failed to fetch dreams:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDreams()
  }, [])

  return (
    <section id="archive" className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            梦境档案
          </span>
        </h2>
        <p className="text-muted-foreground">
          漂浮在虚空中的星云碎片，每一个都承载着独特的梦境
        </p>
      </div>

      {/* Dream Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          正在从星云中收集梦境...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream, index) => (
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

      {/* Load more hint */}
      <div className="mt-12 text-center">
        <button className="px-6 py-3 rounded-full border border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 transition-all duration-300">
          探索更多梦境...
        </button>
      </div>
    </section>
  )
}
