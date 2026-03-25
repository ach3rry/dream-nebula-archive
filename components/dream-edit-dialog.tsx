"use client"

import { useState, useEffect } from "react"
import { X, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DreamEditDialogProps {
  dreamId: number
  initialContent: string
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedContent: string) => void
}

export function DreamEditDialog({
  dreamId,
  initialContent,
  isOpen,
  onClose,
  onUpdate,
}: DreamEditDialogProps) {
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setContent(initialContent)
    setSubmitSuccess(false)
    setErrorMessage(null)
  }, [initialContent, isOpen])

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/dreams/${dreamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "更新梦境失败")
      }

      const data = await response.json()

      // Success!
      setSubmitSuccess(true)
      onUpdate(content.trim())

      // Close dialog after a short delay
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      console.error("Error updating dream:", err)
      setErrorMessage(err instanceof Error ? err.message : "更新梦境失败，请稍后重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl glass-card rounded-2xl p-6 md:p-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">编辑梦境</h2>
          <p className="text-muted-foreground text-sm mt-1">
            修改你的梦境记录
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">梦境已更新！</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-64 p-4 rounded-xl resize-none",
              "bg-nebula-deep/50 text-foreground placeholder:text-muted-foreground",
              "border border-white/10 focus:border-primary/50",
              "focus:outline-none focus:ring-0",
              "text-base leading-relaxed",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            placeholder="梦境内容..."
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSubmit()
              }
            }}
          />
        </div>

        {/* Character count */}
        <div className="mb-4 text-sm text-muted-foreground">
          <span className={content.length > 0 ? "text-primary" : ""}>
            {content.length}
          </span>
          <span> / 2000 字符</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 rounded-full font-medium",
              "bg-white/5 hover:bg-white/10",
              "text-foreground",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting || content === initialContent}
            className={cn(
              "px-6 py-2.5 rounded-full font-medium",
              "bg-gradient-to-r from-primary/20 to-secondary/20",
              "border border-primary/50 hover:border-primary",
              "text-foreground",
              "transition-all duration-200",
              "hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
              "flex items-center gap-2"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <span>保存更改</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
