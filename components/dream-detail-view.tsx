"use client"

import { useEffect, useState, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Tag, ArrowLeft, Edit2, Trash2 } from "lucide-react"
import { Loader2 } from "lucide-react"
import { DreamInterpretation } from "./dream-interpretation"
import { DreamExport } from "./dream-export"

const emotionIcons: Record<string, { icon: string; label: string; color: string; bgGradient: string }> = {
  "平静": { icon: "🌙", label: "平静", color: "text-blue-400", bgGradient: "from-blue-500/20 to-purple-500/20" },
  "愉悦": { icon: "✨", label: "愉悦", color: "text-primary", bgGradient: "from-primary/20 to-secondary/20" },
  "忧郁": { icon: "🌫️", label: "忧郁", color: "text-purple-400", bgGradient: "from-purple-500/20 to-pink-500/20" },
  "悲伤": { icon: "💧", label: "悲伤", color: "text-blue-300", bgGradient: "from-blue-400/20 to-cyan-500/20" },
  "恐惧": { icon: "👁️", label: "恐惧", color: "text-red-400", bgGradient: "from-red-500/20 to-orange-500/20" },
  "兴奋": { icon: "🚀", label: "兴奋", color: "text-yellow-400", bgGradient: "from-yellow-500/20 to-orange-500/20" },
  "焦虑": { icon: "⚡", label: "焦虑", color: "text-orange-400", bgGradient: "from-orange-500/20 to-red-500/20" },
}

interface Dream {
  id: number
  content: string
  title?: string
  emotion?: {
    type: string
    score: number
    confidence: number
  }
  keywords?: string[]
  created_at: string
  updated_at: string
}

export function DreamDetailView() {
  const params = use(useParams())
  const router = useRouter()
  const dreamId = params.id as string

  const [dream, setDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!dreamId) return

    const fetchDream = async () => {
      try {
        const response = await fetch(`/api/dreams/${dreamId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("梦境不存在")
          } else {
            setError("加载失败")
          }
          return
        }
        const data: Dream = await response.json()
        setDream(data)
      } catch (err) {
        console.error("Error fetching dream:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (dreamId) {
      fetchDream()
    }
  }, [dreamId])

  const handleDelete = async () => {
    if (!confirm("确定要删除这个梦境吗？")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/dreams/${dreamId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("删除失败")
      router.push("/")
    } catch (err) {
      alert("删除失败: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !dream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error || "梦境不存在"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  const emotionData = dream.emotion
    ? emotionIcons[dream.emotion.type] || emotionIcons["平静"]
    : null

  const createdDate = new Date(dream.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const gradientClass = emotionData ? `bg-gradient-to-br ${emotionData.bgGradient}` : ""

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回梦境档案</span>
        </button>

        <div className={`glass-card rounded-3xl p-8 md:p-12 ${gradientClass}`}>
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {emotionData && (
                  <>
                    <span className="text-4xl" role="img" aria-label={emotionData.label}>
                      {emotionData.icon}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${emotionData.color}`}>{emotionData.label}</p>
                      {dream.emotion && (
                        <p className="text-xs text-muted-foreground">
                          强度: {(dream.emotion.score * 100).toFixed(0)}% | 置信度: {(dream.emotion.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>{createdDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <DreamExport
                dreamId={parseInt(dreamId)}
                dreamContent={dream.content}
                dreamDate={createdDate}
                emotion={dream.emotion}
              />
              <button
                onClick={() => router.push(`/`)}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                title="编辑"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                title="删除"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {dream.title || "梦境记录"}
            </h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {dream.content}
              </p>
            </div>
          </div>

          {dream.keywords && dream.keywords.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">关键词</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dream.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dream.updated_at !== dream.created_at && (
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-muted-foreground">
                最后更新: {new Date(dream.updated_at).toLocaleString("zh-CN")}
              </p>
            </div>
          )}
        </div>

        {/* 梦境解读 - 赛博周公 */}
        <div className="mt-8">
          <DreamInterpretation
            dreamId={parseInt(dreamId)}
            dreamContent={dream.content}
            emotion={dream.emotion}
          />
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  )
}
