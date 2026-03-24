"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X } from "lucide-react"

interface DreamNebulaProps {
  dreams: Array<{
    id: number
    content: string
    emotion?: {
      type: string
      score: number
    }
  }>
  onClose: () => void
  onDreamClick: (id: number) => void
}

// 情感类型对应的颜色
const emotionColors: Record<string, string> = {
  "平静": "#60a5fa",  // blue
  "愉悦": "#c084fc",  // purple
  "忧郁": "#a78bfa",  // purple-2
  "悲伤": "#93c5fd",  // blue-2
  "恐惧": "#f87171",  // red
  "兴奋": "#fbbf24",  // yellow
  "焦虑": "#fb923c",  // orange
}

// 情感类型对应的发光颜色
const emotionGlowColors: Record<string, string> = {
  "平静": "rgba(96, 165, 250, 0.4)",  // blue glow
  "愉悦": "rgba(192, 132, 252, 0.4)",  // purple glow
  "忧郁": "rgba(167, 139, 250, 0.4)",  // purple-2 glow
  "悲伤": "rgba(147, 197, 253, 0.4)",  // blue-2 glow
  "恐惧": "rgba(248, 113, 113, 0.4)",  // red glow
  "兴奋": "rgba(251, 191, 36, 0.4)",  // yellow glow
  "焦虑": "rgba(251, 146, 60, 0.4)",  // orange glow
}

// 星云背景主题配置
const nebulaThemes: Record<string, {
  primaryColors: string[]
  secondaryColors: string[]
  accentColor: string
  density: number
  flowSpeed: number
}> = {
  "平静": {
    primaryColors: ["#1e3a5f", "#0f2744", "#1a365d"],
    secondaryColors: ["#60a5fa", "#3b82f6", "#2563eb"],
    accentColor: "#93c5fd",
    density: 0.6,
    flowSpeed: 0.3
  },
  "愉悦": {
    primaryColors: ["#4c1d95", "#3b0d7a", "#5b21b6"],
    secondaryColors: ["#c084fc", "#a855f7", "#9333ea"],
    accentColor: "#d8b4fe",
    density: 0.8,
    flowSpeed: 0.5
  },
  "忧郁": {
    primaryColors: ["#372160", "#2d1b4e", "#4c2882"],
    secondaryColors: ["#a78bfa", "#8b5cf6", "#7c3aed"],
    accentColor: "#c4b5fd",
    density: 0.7,
    flowSpeed: 0.35
  },
  "悲伤": {
    primaryColors: ["#1e3a5f", "#1e40af", "#1d4ed8"],
    secondaryColors: ["#93c5fd", "#60a5fa", "#3b82f6"],
    accentColor: "#bfdbfe",
    density: 0.5,
    flowSpeed: 0.25
  },
  "恐惧": {
    primaryColors: ["#450a0a", "#7f1d1d", "#991b1b"],
    secondaryColors: ["#f87171", "#ef4444", "#dc2626"],
    accentColor: "#fca5a5",
    density: 0.9,
    flowSpeed: 0.7
  },
  "兴奋": {
    primaryColors: ["#78350f", "#92400e", "#a16207"],
    secondaryColors: ["#fbbf24", "#f59e0b", "#d97706"],
    accentColor: "#fcd34d",
    density: 0.85,
    flowSpeed: 0.6
  },
  "焦虑": {
    primaryColors: ["#7c2d12", "#9a3412", "#c2410c"],
    secondaryColors: ["#fb923c", "#f97316", "#ea580c"],
    accentColor: "#fdba74",
    density: 0.95,
    flowSpeed: 0.8
  }
}

export function DreamNebula({ dreams, onClose, onDreamClick }: DreamNebulaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredDream, setHoveredDream] = useState<number | null>(null)
  const [dominantEmotion, setDominantEmotion] = useState<string>("平静")
  const animationRef = useRef<number | undefined>(undefined)

  // 使用 ref 跟踪当前粒子数据，用于悬停检测
  const particlesRef = useRef<any[]>([])
  const mousePosRef = useRef({ x: 0, y: 0 })

  // 鼠标移动处理
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 梦境粒子
    interface Particle {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      dreamId: number
      content: string
      color: string
      glowColor: string
      size: number
      baseSize: number
      emotion?: string
    }

    const particles: Particle[] = []

    // 初始化梦境粒子 - 使用螺旋分布
    dreams.forEach((dream, index) => {
      const angle = (index / dreams.length) * Math.PI * 4  // 两圈螺旋
      const radius = 100 + (index / dreams.length) * 250  // 从内到外
      const z = Math.sin(angle * 2) * 100  // 波动起伏

      const emotionType = dream.emotion?.type || "平静"

      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.1,
        dreamId: dream.id,
        content: dream.content.slice(0, 30) + (dream.content.length > 30 ? "..." : ""),
        color: emotionColors[emotionType] || emotionColors["平静"],
        glowColor: emotionGlowColors[emotionType] || emotionGlowColors["平静"],
        size: 4 + (dream.emotion?.score || 0.5) * 5,
        baseSize: 4 + (dream.emotion?.score || 0.5) * 5,
        emotion: emotionType
      })
    })

    // 存储粒子到 ref 用于悬停检测
    particlesRef.current = particles

    // 添加背景星尘
    const stars: Array<{ x: number; y: number; z: number; size: number; brightness: number }> = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 500 - 250,
        size: Math.random() * 2,
        brightness: Math.random()
      })
    }

    // 计算主要情感类型用于星云主题
    const emotionCounts: Record<string, number> = {}
    dreams.forEach(dream => {
      const emotion = dream.emotion?.type || "平静"
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })
    const calculatedDominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "平静"
    setDominantEmotion(calculatedDominantEmotion)
    const nebulaTheme = nebulaThemes[calculatedDominantEmotion] || nebulaThemes["平静"]

    // 程序化星云云雾
    const nebulaClouds: Array<{
      x: number
      y: number
      radius: number
      color: string
      alpha: number
      vx: number
      vy: number
      phase: number
    }> = []

    // 根据主题密度创建云雾
    const cloudCount = Math.floor(15 * nebulaTheme.density)
    for (let i = 0; i < cloudCount; i++) {
      const isPrimary = i % 3 === 0
      const colors = isPrimary ? nebulaTheme.primaryColors : nebulaTheme.secondaryColors
      nebulaClouds.push({
        x: Math.random() * canvas.width * 1.5 - canvas.width * 0.75,
        y: Math.random() * canvas.height * 1.5 - canvas.height * 0.75,
        radius: 150 + Math.random() * 300,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.02 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * nebulaTheme.flowSpeed,
        vy: (Math.random() - 0.5) * nebulaTheme.flowSpeed,
        phase: Math.random() * Math.PI * 2
      })
    }

    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0
    let currentRotationX = 0
    let currentRotationY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - canvas.width / 2) * 0.0005
      mouseY = (e.clientY - canvas.height / 2) * 0.0005
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    })
    canvas.addEventListener("click", handleClick)

    function project3D(x: number, y: number, z: number): { x: number; y: number; scale: number } {
      const fov = 400
      const scale = fov / (fov + z)
      return {
        x: x * scale + (canvas?.width || 0) / 2,
        y: y * scale + (canvas?.height || 0) / 2,
        scale
      }
    }

    function handleClick(e: MouseEvent) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      for (const particle of particles) {
        const projected = project3D(particle.x, particle.y, particle.z)
        const dx = clickX - projected.x
        const dy = clickY - projected.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 20 * projected.scale) {
          onDreamClick(particle.dreamId)
          return
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      // 绘制渐变背景
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      )
      bgGradient.addColorStop(0, nebulaTheme.primaryColors[0] + "40")
      bgGradient.addColorStop(0.5, nebulaTheme.primaryColors[1] + "20")
      bgGradient.addColorStop(1, "#030712")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制程序化星云云雾
      const time = Date.now() * 0.001
      nebulaClouds.forEach(cloud => {
        // 更新云雾位置
        cloud.x += cloud.vx
        cloud.y += cloud.vy
        cloud.phase += 0.01

        // 边界检查，循环移动
        if (cloud.x < -canvas.width * 0.5) cloud.x = canvas.width * 0.5
        if (cloud.x > canvas.width * 0.5) cloud.x = -canvas.width * 0.5
        if (cloud.y < -canvas.height * 0.5) cloud.y = canvas.height * 0.5
        if (cloud.y > canvas.height * 0.5) cloud.y = -canvas.height * 0.5

        // 呼吸效果
        const breathingAlpha = cloud.alpha + Math.sin(cloud.phase) * 0.01

        // 绘制云雾
        const gradient = ctx.createRadialGradient(
          canvas.width / 2 + cloud.x,
          canvas.height / 2 + cloud.y,
          0,
          canvas.width / 2 + cloud.x,
          canvas.height / 2 + cloud.y,
          cloud.radius
        )
        gradient.addColorStop(0, cloud.color + Math.floor(breathingAlpha * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(0.5, cloud.color + Math.floor(breathingAlpha * 0.5 * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // 绘制高光点缀
      nebulaClouds.forEach((cloud, i) => {
        if (i % 3 === 0) {
          const sparkleX = canvas.width / 2 + cloud.x + Math.cos(time + cloud.phase) * cloud.radius * 0.5
          const sparkleY = canvas.height / 2 + cloud.y + Math.sin(time + cloud.phase) * cloud.radius * 0.5
          const sparkleAlpha = (Math.sin(time * 2 + cloud.phase) + 1) * 0.5 * 0.3

          ctx.beginPath()
          ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2)
          ctx.fillStyle = nebulaTheme.accentColor + Math.floor(sparkleAlpha * 255).toString(16).padStart(2, '0')
          ctx.fill()
        }
      })

      // 悬停检测 - 跟踪鼠标位置
      let foundHover = false
      const mouseX = mousePosRef.current.x
      const mouseY = mousePosRef.current.y

      // 平滑旋转
      targetRotationX += (mouseY - targetRotationX) * 0.05
      targetRotationY += (mouseX - targetRotationY) * 0.05
      currentRotationX += (targetRotationX - currentRotationX) * 0.02
      currentRotationY += (targetRotationY - currentRotationY) * 0.02

      const cosX = Math.cos(currentRotationX)
      const sinX = Math.sin(currentRotationX)
      const cosY = Math.cos(currentRotationY)
      const sinY = Math.sin(currentRotationY)

      // 绘制背景星尘
      stars.forEach(star => {
        // 旋转星尘
        let x = star.x
        let y = star.y * cosX - star.z * sinX
        let z = star.y * sinX + star.z * cosX
        x = x * cosY - z * sinY
        z = x * sinY + z * cosY

        const projected = project3D(x, y, z)
        const alpha = star.brightness * 0.5 * projected.scale

        ctx.beginPath()
        ctx.arc(projected.x, projected.y, star.size * projected.scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      })

      // 绘制连线
      ctx.strokeStyle = "rgba(147, 197, 253, 0.05)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dz = particles[i].z - particles[j].z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 200) {
            const p1 = project3D(particles[i].x, particles[i].y, particles[i].z)
            const p2 = project3D(particles[j].x, particles[j].y, particles[j].z)

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // 更新和绘制梦境粒子
      particles.forEach((particle, index) => {
        // 缓慢移动
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // 边界检查
        const maxDist = 400
        const dist = Math.sqrt(particle.x ** 2 + particle.y ** 2 + particle.z ** 2)
        if (dist > maxDist) {
          particle.vx *= -0.5
          particle.vy *= -0.5
          particle.vz *= -0.5
        }

        // 旋转
        let x = particle.x
        let y = particle.y * cosX - particle.z * sinX
        let z = particle.y * sinX + particle.z * cosX
        x = x * cosY - z * sinY
        z = x * sinY + z * cosY

        const projected = project3D(x, y, z)

        // 悬停检测
        const dx = mouseX - projected.x
        const dy = mouseY - projected.y
        const hoverDist = Math.sqrt(dx * dx + dy * dy)
        const isHovered = hoverDist < particle.size * projected.scale * 2

        if (isHovered && !foundHover) {
          setHoveredDream(particle.dreamId)
          foundHover = true
        }

        // 悬停效果 - 放大粒子
        const scaleMultiplier = isHovered ? 1.5 : 1.0
        particle.size = particle.baseSize * scaleMultiplier

        // 绘制外层光晕
        const outerGlow = ctx.createRadialGradient(
          projected.x, projected.y, 0,
          projected.x, projected.y, particle.size * projected.scale * 4
        )
        outerGlow.addColorStop(0, particle.glowColor)
        outerGlow.addColorStop(0.5, particle.glowColor.replace("0.4", "0.2"))
        outerGlow.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(projected.x, projected.y, particle.size * projected.scale * 4, 0, Math.PI * 2)
        ctx.fillStyle = outerGlow
        ctx.fill()

        // 绘制中层光晕
        const innerGlow = ctx.createRadialGradient(
          projected.x, projected.y, 0,
          projected.x, projected.y, particle.size * projected.scale * 2
        )
        innerGlow.addColorStop(0, particle.color + "80")
        innerGlow.addColorStop(1, particle.color + "00")

        ctx.beginPath()
        ctx.arc(projected.x, projected.y, particle.size * projected.scale * 2, 0, Math.PI * 2)
        ctx.fillStyle = innerGlow
        ctx.fill()

        // 绘制核心
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, particle.size * projected.scale, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // 悬停时显示内容提示框
        if (isHovered) {
          const padding = 12
          const textWidth = ctx.measureText(particle.content).width
          const boxWidth = textWidth + padding * 2
          const boxHeight = 40
          const boxY = projected.y - 40 * projected.scale

          // 背景
          ctx.fillStyle = "rgba(3, 7, 18, 0.9)"
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 2
          roundRect(ctx, projected.x - boxWidth / 2, boxY - boxHeight, boxWidth, boxHeight, 8)
          ctx.fill()
          ctx.stroke()

          // 文字
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
          ctx.font = "13px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(particle.content, projected.x, boxY - boxHeight / 2)

          // 情感标签
          const emotionLabel = particle.emotion || "未知"
          ctx.font = "11px sans-serif"
          ctx.fillStyle = particle.color
          ctx.fillText(emotionLabel, projected.x, boxY + 15 * projected.scale)
        }
      })

      // 如果没有悬停任何粒子，清除悬停状态
      if (!foundHover && hoveredDream !== null) {
        setHoveredDream(null)
      }

      // 辅助函数：绘制圆角矩形
      function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
      // 移除悬停检测的 mousemove 监听器
      canvas.onmousemove = null
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dreams, onDreamClick])

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* 提示文字 */}
      <div className="absolute top-6 left-6 text-white/80 text-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="font-semibold">梦境星云</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
            {dominantEmotion}主题
          </span>
          <span className="text-white/50">•</span>
          <span className="text-white/60">{dreams.length}个梦境</span>
        </div>
        <p className="text-xs text-white/50 mt-1">拖动鼠标旋转 • 滚轮缩放 • 点击查看详情</p>
      </div>

      {/* 画布 */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
      />
    </div>
  )
}
