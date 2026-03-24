"use client"

import { cn } from "@/lib/utils"
import { Calendar, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

// 中文情感类型映射（后端返回）到图标的映射
const emotionIcons: Record<string, { icon: string; label: string; color: string }> = {
  "平静": { icon: "🌙", label: "平静", color: "text-blue-400" },
  "CALM": { icon: "🌙", label: "平静", color: "text-blue-400" },
  "愉悦": { icon: "✨", label: "愉悦", color: "text-primary" },
  "JOYFUL": { icon: "✨", label: "愉悦", color: "text-primary" },
  "忧郁": { icon: "🌫️", label: "忧郁", color: "text-purple-400" },
  "MELANCHOLY": { icon: "🌫️", label: "忧郁", color: "text-purple-400" },
  "悲伤": { icon: "💧", label: "悲伤", color: "text-blue-300" },
  "SAD": { icon: "💧", label: "悲伤", color: "text-blue-300" },
  "恐惧": { icon: "👁️", label: "恐惧", color: "text-red-400" },
  "FEAR": { icon: "👁️", label: "恐惧", color: "text-red-400" },
  "兴奋": { icon: "🚀", label: "兴奋", color: "text-yellow-400" },
  "EXCITED": { icon: "🚀", label: "兴奋", color: "text-yellow-400" },
  "焦虑": { icon: "⚡", label: "焦虑", color: "text-orange-400" },
  "ANXIOUS": { icon: "⚡", label: "焦虑", color: "text-orange-400" },
  // 兼容旧的英文 mood
  mystical: { icon: "✨", label: "神秘", color: "text-primary" },
  peaceful: { icon: "🌙", label: "宁静", color: "text-blue-400" },
  adventurous: { icon: "🚀", label: "冒险", color: "text-secondary" },
  surreal: { icon: "🌀", label: "超现实", color: "text-purple-400" },
  emotional: { icon: "💫", label: "情感", color: "text-pink-400" },
}

interface DreamCardProps {
  id: number
  title: string
  date: string
  mood?: string
  summary: string
  index?: number
}

export function DreamCard({ id, title, date, mood = "mystical", summary, index = 0 }: DreamCardProps) {
  const router = useRouter()
  const emotionData = emotionIcons[mood] || emotionIcons.mystical

  const handleClick = () => {
    router.push(`/dreams/${id}`)
  }

  return (
    <article
      onClick={handleClick}
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

      {/* Card content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>

          {/* Emotion indicator */}
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl",
              "bg-gradient-to-br from-primary/10 to-secondary/10",
              "border border-primary/20 group-hover:border-primary/50",
              "transition-all duration-300"
            )}
            title={`情感: ${emotionData.label}`}
          >
            <span className="text-2xl" role="img" aria-label={emotionData.label}>
              {emotionData.icon}
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
          <span className={cn("capitalize", emotionData.color)}>{emotionData.label}</span>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute w-1 h-1 bg-primary rounded-full animate-ping" />
        <span className="absolute w-1 h-1 bg-secondary rounded-full animate-ping" style={{ animationDelay: "0.3s", left: "10px" }} />
      </div>
    </article>
  )
}
