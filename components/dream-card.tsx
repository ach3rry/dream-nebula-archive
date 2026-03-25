"use client"

import { cn } from "@/lib/utils"
import { Calendar, Sparkles, Edit2, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mood icons with neon colors - 扩展情感图标
const moodIcons: Record<string, { icon: string; color: string }> = {
  mystical: { icon: "✨", color: "text-primary" },
  peaceful: { icon: "🌙", color: "text-blue-400" },
  adventurous: { icon: "🚀", color: "text-secondary" },
  surreal: { icon: "🌀", color: "text-purple-400" },
  emotional: { icon: "💧", color: "text-pink-400" },
}

interface DreamCardProps {
  id: number
  title: string
  date: string
  mood: keyof typeof moodIcons
  summary: string
  index?: number
  onDelete?: (id: number) => void
}

export function DreamCard({ id, title, date, mood, summary, index = 0, onDelete }: DreamCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const moodData = moodIcons[mood] || moodIcons.mystical

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止冒泡到卡片点击

    if (!confirm("确定要删除这个梦境吗？")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/dreams/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("删除失败")

      // 通知父组件刷新列表
      onDelete?.(id)
    } catch (error) {
      console.error("Error deleting dream:", error)
      alert("删除失败，请稍后重试")
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止冒泡到卡片点击
    router.push(`/dreams/${id}`)
  }

  return (
    <article
      onClick={() => router.push(`/dreams/${id}`)}
      className={cn(
        "group relative p-6 rounded-2xl cursor-pointer",
        "glass-card",
        "hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,245,255,0.15),0_0_80px_rgba(255,0,255,0.1)]",
        "transition-all duration-500 ease-out",
        "animate-float"
      )}
      style={{
        animationDelay: `${index * 0.5}s`,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100",
          "bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30",
          "blur-md transition-opacity duration-500"
        )}
      />

      {/* Quick Action Buttons - 只在 hover 时显示 */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          onClick={handleEdit}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-300 hover:scale-110"
          title="编辑/查看详情"
        >
          <Eye className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 hover:scale-110 disabled:opacity-50"
          title="删除"
        >
          {deleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 text-red-400" />
          )}
        </button>
      </div>

      {/* Card content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pr-20">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>

          {/* Mood indicator */}
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl",
              "bg-gradient-to-br from-primary/10 to-secondary/10",
              "border border-primary/20 group-hover:border-primary/50",
              "transition-all duration-300"
            )}
          >
            <span className="text-2xl" role="img" aria-label={mood}>
              {moodData.icon}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
          {summary}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary/60" />
          <span className={cn("capitalize", moodData.color)}>{mood}</span>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute w-1 h-1 bg-primary rounded-full animate-ping" />
        <span className="absolute w-1 h-1 bg-secondary rounded-full animate-ping" style={{ animationDelay: "0.3s", left: "10px" }} />
      </div>
    </article>
  )
}
