"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Wand2, Loader2 } from "lucide-react"

interface Dream {
  id: number
  content: string
  emotion?: string
  created_at: string
}

export function DreamRecorder() {
  const [dreamText, setDreamText] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sparkleIdRef = useRef(0)

  const handleSubmit = async () => {
    if (!dreamText.trim()) return

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: dreamText }),
      })

      if (!response.ok) {
        throw new Error("Failed to save dream")
      }

      const data: Dream = await response.json()
      setSubmitStatus({
        type: "success",
        message: `梦境已记录！ID: ${data.id}`,
      })
      setDreamText("")

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3000)
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "保存失败，请稍后重试",
      })
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate sparkles on hover
  useEffect(() => {
    if (!isHovering || !buttonRef.current) return

    const interval = setInterval(() => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const x = Math.random() * rect.width
      const y = Math.random() * rect.height

      const newSparkle = { id: sparkleIdRef.current++, x, y }
      setSparkles((prev) => [...prev.slice(-15), newSparkle])
    }, 100)

    return () => clearInterval(interval)
  }, [isHovering])

  // Remove old sparkles
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSparkles((prev) => prev.slice(1))
    }, 800)
    return () => clearTimeout(timeout)
  }, [sparkles])

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            梦境记录仪
          </span>
        </h2>
        <p className="text-muted-foreground">
          在这里记录你的梦境，让它们化作星云中的光芒
        </p>
      </div>

      {/* Dream Input Area */}
      <div className="relative group">
        {/* Animated border gradient */}
        <div
          className={cn(
            "absolute -inset-[2px] rounded-2xl opacity-75 blur-sm transition-opacity duration-500",
            "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-border-flow",
            "group-focus-within:opacity-100 group-hover:opacity-100"
          )}
        />

        {/* Glass container */}
        <div className="relative glass-card rounded-2xl p-1">
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="昨晚，我梦见自己漂浮在紫色的星云之中..."
            className={cn(
              "w-full h-48 md:h-64 p-6 rounded-xl resize-none",
              "bg-nebula-deep/50 text-foreground placeholder:text-muted-foreground",
              "border border-transparent",
              "focus:outline-none focus:ring-0",
              "text-lg leading-relaxed",
              "transition-all duration-300"
            )}
            aria-label="梦境输入区域"
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-primary/50 rounded-tl" />
        <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-primary/50 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-secondary/50 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-secondary/50 rounded-br" />
      </div>

      {/* Manifest Button */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          ref={buttonRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleSubmit}
          disabled={!dreamText.trim() || isSubmitting}
          className={cn(
            "relative px-10 py-4 rounded-full font-semibold text-lg",
            "bg-gradient-to-r from-primary/20 to-secondary/20",
            "border border-primary/50 hover:border-primary",
            "text-foreground",
            "transition-all duration-300",
            "hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.3),0_0_60px_rgba(255,0,255,0.2)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
            "overflow-hidden group"
          )}
          aria-label="记录梦境"
        >
          {/* Sparkle effects */}
          {sparkles.map((sparkle) => (
            <span
              key={sparkle.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-sparkle pointer-events-none"
              style={{
                left: sparkle.x,
                top: sparkle.y,
                boxShadow: "0 0 6px 2px rgba(255,255,255,0.8)",
              }}
            />
          ))}

          {/* Button content */}
          <span className="relative flex items-center gap-3">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Manifesting...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Manifest</span>
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              </>
            )}
          </span>

          {/* Hover glow overlay */}
          <span
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}
          />
        </button>

        {/* Status message */}
        {submitStatus.type && (
          <div
            className={cn(
              "text-sm px-4 py-2 rounded-lg",
              submitStatus.type === "success"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            )}
          >
            {submitStatus.message}
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <span className={dreamText.length > 0 ? "text-primary" : ""}>
          {dreamText.length}
        </span>
        <span> / 2000 字符</span>
      </div>
    </section>
  )
}
