"use client"

import { useState } from "react"
import { Share2, Check, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface DreamShareProps {
  dreamId: number
  dreamContent: string
}

export function DreamShare({ dreamId, dreamContent }: DreamShareProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // 生成分享链接
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/dreams/${dreamId}`
    : ""

  // 生成分享文本
  const shareText = `我记录了一个梦境：${dreamContent.slice(0, 50)}...`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleShare = async (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      weibo: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      douban: `https://www.douban.com/share/service?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          "p-2 rounded-full",
          "bg-primary/10 hover:bg-primary/20 transition-colors",
          "border border-primary/20",
          "relative group"
        )}
        title="分享梦境"
      >
        <Share2 className="w-4 h-4 text-primary" />
        <span className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2",
          "px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100",
          "bg-foreground text-background transition-opacity font-bold"
        )}>
          分享
        </span>
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "glass-card rounded-xl p-2 min-w-[200px]",
            "border border-primary/20",
            "animate-fade-in"
          )}>
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                "hover:bg-primary/10 transition-colors",
                "text-left"
              )}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Link className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm">
                {copied ? "已复制链接" : "复制链接"}
              </span>
            </button>

            <div className="my-1 border-t border-white/10" />

            {/* Share to Twitter */}
            <button
              onClick={() => handleShare("twitter")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                "hover:bg-primary/10 transition-colors",
                "text-left"
              )}
            >
              <span className="text-base">𝕏</span>
              <span className="text-sm">分享到 Twitter</span>
            </button>

            {/* Share to Weibo */}
            <button
              onClick={() => handleShare("weibo")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                "hover:bg-primary/10 transition-colors",
                "text-left"
              )}
            >
              <span className="text-base">🌊</span>
              <span className="text-sm">分享到微博</span>
            </button>

            {/* Share to Douban */}
            <button
              onClick={() => handleShare("douban")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                "hover:bg-primary/10 transition-colors",
                "text-left"
              )}
            >
              <span className="text-base">📖</span>
              <span className="text-sm">分享到豆瓣</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
