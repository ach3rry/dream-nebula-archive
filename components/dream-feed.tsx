"use client"

import { DreamCard } from "./dream-card"

// Sample dream data
const sampleDreams = [
  {
    id: 1,
    title: "紫色星云中的漂流",
    date: "2026-03-23",
    mood: "mystical" as const,
    summary: "我发现自己漂浮在一片无边无际的紫色星云中，周围是闪烁的星辰。每当我伸出手去触碰一颗星星，它就会变成一只发光的蝴蝶飞向远方...",
  },
  {
    id: 2,
    title: "深海中的水晶宫殿",
    date: "2026-03-22",
    mood: "peaceful" as const,
    summary: "在梦中我潜入了一片幽蓝的深海，发现了一座由透明水晶建造的宫殿。宫殿里的每个房间都播放着不同的记忆，像是全息投影一般...",
  },
  {
    id: 3,
    title: "穿越时空的列车",
    date: "2026-03-21",
    mood: "adventurous" as const,
    summary: "我登上了一列穿梭于不同时代的银色列车。每一节车厢都通向不同的历史时期，我在古罗马、未来都市和恐龙时代之间自由穿行...",
  },
  {
    id: 4,
    title: "镜子迷宫",
    date: "2026-03-20",
    mood: "surreal" as const,
    summary: "一个由无数镜子组成的迷宫，但每面镜子中的我都有着不同的表情和姿态。有些镜中人在微笑，有些在哭泣，有些甚至在说着我听不懂的语言...",
  },
  {
    id: 5,
    title: "消失的童年小屋",
    date: "2026-03-19",
    mood: "emotional" as const,
    summary: "我回到了已经被拆除多年的童年老屋，一切都和记忆中一模一样。奶奶在厨房做饭的香味飘来，窗外是永远停留在夏天的阳光...",
  },
  {
    id: 6,
    title: "会说话的星座",
    date: "2026-03-18",
    mood: "mystical" as const,
    summary: "夜空中的星座突然活了过来，猎户座开始和我讲述他千年来目睹的故事，北斗七星指引我找到了一颗属于我的未命名星球...",
  },
]

export function DreamFeed() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDreams.map((dream, index) => (
          <DreamCard
            key={dream.id}
            title={dream.title}
            date={dream.date}
            mood={dream.mood}
            summary={dream.summary}
            index={index}
          />
        ))}
      </div>

      {/* Load more hint */}
      <div className="mt-12 text-center">
        <button className="px-6 py-3 rounded-full border border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 transition-all duration-300">
          探索更多梦境...
        </button>
      </div>
    </section>
  )
}
