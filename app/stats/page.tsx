import { Starfield } from "@/components/starfield"
import { Navbar } from "@/components/navbar"
import { StatsDashboard } from "@/components/stats-dashboard"

export const metadata = {
  title: "数据统计 - 梦境星云档案馆",
  description: "查看你的梦境统计数据和情感分析",
}

export default function StatsPage() {
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
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-neon-purple/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-border-flow">
                梦境统计
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              深入了解你的梦境世界，探索潜意识的奥秘
            </p>
          </div>

          {/* Stats Dashboard */}
          <StatsDashboard />
        </div>
      </main>
    </div>
  )
}
