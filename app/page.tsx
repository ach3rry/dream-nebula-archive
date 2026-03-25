"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"
import { DreamRecorder } from "@/components/dream-recorder"
import { DreamFeed } from "@/components/dream-feed"
import { DreamNebula } from "@/components/dream-nebula"
import { fetchDreams } from "@/lib/api-client"
import { Sparkles, Eye } from "lucide-react"

export default function HomePage() {
  const [showNebula, setShowNebula] = useState(false)
  const [dreams, setDreams] = useState<any[]>([])

  const handleOpenNebula = async () => {
    // 加载梦境数据
    const dreamsData = await fetchDreams(1)
    setDreams(dreamsData)
    setShowNebula(true)
  }

  if (showNebula) {
    return (
      <DreamNebula
        dreams={dreams}
        onClose={() => setShowNebula(false)}
        onDreamClick={(id) => {
          setShowNebula(false)
          window.location.href = `/dreams/${id}`
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-nebula-deep via-nebula-purple to-nebula-blue animate-nebula"
        aria-hidden="true"
      />

      {/* Star field canvas */}
      <Starfield />

      {/* Nebula glow effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Top left glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        {/* Top right glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
        {/* Bottom center glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-neon-purple/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section with Dream Recorder */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12">
          {/* Hero text */}
          <div className="text-center mb-12 px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block mb-2">记录你的</span>
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-border-flow">
                梦境星云
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              每一个梦境都是宇宙中独特的星辰，让 AI 解析你的潜意识，在星空中找到属于你的那颗星
            </p>
          </div>

          {/* Nebula View Button */}
          <div className="mb-8">
            <button
              onClick={handleOpenNebula}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="font-semibold text-foreground">查看梦境星云</span>
                <Eye className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Dream Recorder */}
          <DreamRecorder />
        </section>

        {/* Divider */}
        <div className="relative h-32 flex items-center justify-center">
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(0,245,255,0.5)]" />
        </div>

        {/* Dream Feed */}
        <DreamFeed />

        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-border/30">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Dream Nebula Archive - 梦境星云档案馆
            </p>
            <p className="text-muted-foreground/60 text-xs mt-2">
              记录梦境，探索潜意识的无限宇宙
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
