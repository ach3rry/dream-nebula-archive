"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Tag, ArrowLeft, Edit2, Trash2 } from "lucide-react"
import { Loader2 } from "lucide-react"
import { DreamInterpretation } from "./dream-interpretation"
import { DreamEditDialog } from "./dream-edit-dialog"
import { fetchDream, deleteDream as apiDeleteDream } from "@/lib/api-client"

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

interface DreamDetailViewProps {
  dreamId: string
}

export function DreamDetailView({ dreamId }: DreamDetailViewProps) {
  const router = useRouter()

  const [dream, setDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const loadDream = async () => {
      try {
        const data = await fetchDream(parseInt(dreamId))
        if (!data) {
          setError("梦境不存在")
          return
        }
        setDream(data)
      } catch (err) {
        console.error("Error fetching dream:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    loadDream()
  }, [dreamId])

  const handleDelete = async () => {
    if (!confirm("确定要删除这个梦境吗？")) return

    setDeleting(true)
    try {
      const success = await apiDeleteDream(parseInt(dreamId))
      if (!success) throw new Error("删除失败")
      router.push("/")
    } catch (err) {
      alert("删除失败: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setDeleting(false)
    }
  }

  const handleDreamUpdate = (updatedContent: string) => {
    if (dream) {
      setDream({ ...dream, content: updatedContent })
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
      {/* Animated background gradient - 和主页一样的星空背景 */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-nebula-deep via-nebula-purple to-nebula-blue animate-nebula"
        aria-hidden="true"
      />

      {/* 星云光晕效果 - 和主页一样 */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-neon-purple/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回梦境档案</span>
        </button>

        {/* 梦境卡片 - 使用和主页一样的果冻质感 */}
        <div className="relative group">
          {/* 动画边框渐变 */}
          <div className="absolute -inset-[2px] rounded-3xl opacity-50 blur-sm bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-border-flow" />

          {/* Glass container */}
          <div className="relative glass-card rounded-3xl p-8 md:p-12">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {emotionData && (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
                        <span className="text-2xl" role="img" aria-label={emotionData.label}>
                          {emotionData.icon}
                        </span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${emotionData.color}`}>{emotionData.label}</p>
                        {dream.emotion && (
                          <p className="text-xs text-foreground/60">
                            强度: {(dream.emotion.score * 100).toFixed(0)}% | 置信度: {(dream.emotion.confidence * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{createdDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="relative group p-2.5 rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:scale-105 active:scale-95"
                  title="编辑"
                >
                  {/* 渐变背景层 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-lg" />
                  {/* 内部高光 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* 边缘柔光 */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Edit2 className="relative z-10 w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="relative group p-2.5 rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="删除"
                >
                  {/* 渐变背景层 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/15 to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-lg" />
                  {/* 内部高光 */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* 边缘柔光 */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {deleting ? (
                    <Loader2 className="relative z-10 w-4 h-4 text-red-400 animate-spin" />
                  ) : (
                    <Trash2 className="relative z-10 w-4 h-4 text-red-400/70 group-hover:text-red-400 transition-colors duration-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-border-flow">
                  {dream.title || "梦境记录"}
                </span>
              </h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                  {dream.content}
                </p>
              </div>
            </div>

            {dream.keywords && dream.keywords.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-foreground/60" />
                  <span className="text-sm text-foreground/60">关键词</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dream.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-block px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/30 text-foreground font-bold text-base hover:from-primary/25 hover:to-secondary/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 cursor-default"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {dream.updated_at !== dream.created_at && (
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-foreground/50">
                  最后更新: {new Date(dream.updated_at).toLocaleString("zh-CN")}
                </p>
              </div>
            )}
          </div>

          {/* 角落装饰 - 和主页一样 */}
          <div className="absolute top-6 left-6 w-3 h-3 border-l-2 border-t-2 border-primary/50 rounded-tl" />
          <div className="absolute top-6 right-6 w-3 h-3 border-r-2 border-t-2 border-secondary/50 rounded-tr" />
          <div className="absolute bottom-6 left-6 w-3 h-3 border-l-2 border-b-2 border-primary/50 rounded-bl" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-secondary/50 rounded-br" />
        </div>

        {/* 梦境解读 - 赛博周公 */}
        <div className="mt-8">
          <DreamInterpretation
            dreamId={parseInt(dreamId)}
            dreamContent={dream.content}
            emotion={dream.emotion}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      {dream && (
        <DreamEditDialog
          dreamId={parseInt(dreamId)}
          initialContent={dream.content}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleDreamUpdate}
        />
      )}
    </div>
  )
}
