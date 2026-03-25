"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NebulaSkeletonProps {
  message?: string
  subMessage?: string
  className?: string
}

// 数据流粒子
interface DataParticle {
  id: number
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
}

export function NebulaSkeleton({
  message = "赛博周公正在解读你的梦境...",
  subMessage = "解析情感符号 • 生成星云参数",
  className
}: NebulaSkeletonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<DataParticle[]>([])
  const [glitchActive, setGlitchActive] = useState(false)

  // 初始化数据流粒子
  useEffect(() => {
    const newParticles: DataParticle[] = []
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 60,
        speed: 0.002 + Math.random() * 0.003,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7
      })
    }
    setParticles(newParticles)
  }, [])

  // 随机触发毛刺效果
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 50 + Math.random() * 100)
      }
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  // 背景星云动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 星云粒子
    interface NebulaParticle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      maxRadius: number
      alpha: number
      hue: number
      life: number
      maxLife: number
    }

    const nebulaParticles: NebulaParticle[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.3 + Math.random() * 1.2
      const hue = 180 + Math.random() * 60

      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 0,
        maxRadius: 40 + Math.random() * 80,
        alpha: 0.4 + Math.random() * 0.4,
        hue,
        life: 0,
        maxLife: 120 + Math.random() * 80
      }
    }

    const spawnInterval = setInterval(() => {
      if (nebulaParticles.length < 25) {
        nebulaParticles.push(createParticle())
      }
    }, 120)

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(3, 7, 18, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = nebulaParticles.length - 1; i >= 0; i--) {
        const p = nebulaParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++

        const progress = p.life / p.maxLife
        p.radius = p.maxRadius * Math.sin(progress * Math.PI)
        p.alpha = (1 - progress) * 0.4

        if (p.life >= p.maxLife) {
          nebulaParticles.splice(i, 1)
          continue
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 70%, 50%, ${p.alpha * 0.5})`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      clearInterval(spawnInterval)
    }
  }, [])

  return (
    <div className={cn("relative w-full h-full min-h-[400px] bg-[#030712] rounded-2xl overflow-hidden", className)}>
      {/* 背景画布 */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 霓虹雾气效果层 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* 数据涟漪 - 3层呼吸感模糊涟漪 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* 外层涟漪 */}
        <motion.div
          className="absolute rounded-full border-2 border-cyan-500/20"
          style={{
            width: 280,
            height: 280,
            filter: "blur(2px)",
            boxShadow: "0 0 40px rgba(6, 182, 212, 0.15), 0 0 80px rgba(6, 182, 212, 0.1)"
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 中层涟漪 */}
        <motion.div
          className="absolute rounded-full border-2 border-cyan-400/30"
          style={{
            width: 200,
            height: 200,
            filter: "blur(1.5px)",
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.2), 0 0 60px rgba(34, 211, 238, 0.15)"
          }}
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* 内层涟漪 - 星云收缩 */}
        <motion.div
          className="absolute rounded-full border-2 border-pink-500/40"
          style={{
            width: 120,
            height: 120,
            filter: "blur(1px)",
            boxShadow: "0 0 25px rgba(236, 72, 153, 0.3), 0 0 50px rgba(236, 72, 153, 0.2)"
          }}
          animate={{
            scale: [1.1, 0.95, 1.1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* 数据流粒子 - 沿圆环路径运动 */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full bg-cyan-400"
              style={{
                boxShadow: "0 0 8px 2px rgba(34, 211, 238, 0.6)"
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 中心内容 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-6">
          {/* 核心星元 - 粒子流大脑 */}
          <div className="relative w-24 h-24 mx-auto">
            {/* 外层光晕 */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              animate={{
                background: [
                  "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
                  "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)"
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* 粒子流大脑 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4">
                    <animate
                      attributeName="stop-color"
                      values="#06b6d4;#ec4899;#06b6d4"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#ec4899">
                    <animate
                      attributeName="stop-color"
                      values="#ec4899;#06b6d4;#ec4899"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>
              </defs>

              {/* 大脑轮廓 - 由粒子点阵组成 */}
              <g fill="url(#particleGradient)">
                {/* 上层粒子 */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i / 12) * Math.PI - Math.PI / 2
                  const radius = 25 + Math.sin(Date.now() * 0.002 + i) * 3
                  const x = 50 + Math.cos(angle) * radius
                  const y = 35 + Math.sin(angle) * radius * 0.6
                  return (
                    <motion.circle
                      key={`top-${i}`}
                      cx={x}
                      cy={y}
                      r={1.5}
                      animate={{
                        r: [1, 2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  )
                })}

                {/* 中层粒子 */}
                {[...Array(16)].map((_, i) => {
                  const angle = (i / 16) * Math.PI * 2
                  const radius = 20 + Math.cos(Date.now() * 0.003 + i) * 2
                  const x = 50 + Math.cos(angle) * radius
                  const y = 50 + Math.sin(angle) * radius
                  return (
                    <motion.circle
                      key={`mid-${i}`}
                      cx={x}
                      cy={y}
                      r={1.2}
                      animate={{
                    r: [0.8, 1.8, 0.8],
                        opacity: [0.4, 0.9, 0.4]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: i * 0.08
                      }}
                    />
                  )
                })}

                {/* 下层粒子 */}
                {[...Array(10)].map((_, i) => {
                  const angle = (i / 10) * Math.PI + Math.PI / 2
                  const radius = 22 + Math.sin(Date.now() * 0.0025 + i) * 2.5
                  const x = 50 + Math.cos(angle) * radius
                  const y = 62 + Math.sin(angle) * radius * 0.5
                  return (
                    <motion.circle
                      key={`btm-${i}`}
                      cx={x}
                      cy={y}
                      r={1.5}
                      animate={{
                        r: [1, 2.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: i * 0.12
                      }}
                    />
                  )
                })}
              </g>

              {/* 流入流出的粒子效果 */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2
                  const radius = 35
                  return (
                    <motion.circle
                      key={`flow-${i}`}
                      cx={50 + Math.cos(angle) * radius}
                      cy={50 + Math.sin(angle) * radius}
                      r={1}
                      fill="#06b6d4"
                      animate={{
                        cx: [
                          50 + Math.cos(angle) * radius,
                          50 + Math.cos(angle) * 15,
                          50 + Math.cos(angle) * radius
                        ],
                        cy: [
                          50 + Math.sin(angle) * radius,
                          50 + Math.sin(angle) * 15,
                          50 + Math.sin(angle) * radius
                        ],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  )
                })}
              </motion.g>
            </svg>

            {/* 内部脉冲核心 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(236, 72, 153, 0.6) 100%)",
                  boxShadow: "0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(236, 72, 153, 0.6)"
                }}
              />
            </motion.div>
          </div>

          {/* 梦境显影 - 带毛刺效果的文字 */}
          <div className="space-y-4">
            {/* 主标题 - 呼吸闪烁 + 毛刺 */}
            <motion.div
              className="relative"
              animate={{
                opacity: glitchActive ? [1, 0.8, 1, 0.9, 1] : [0.7, 1, 0.7],
                x: glitchActive ? [0, -2, 1, -1, 0] : 0
              }}
              transition={{
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 0.1 }
              }}
            >
              <h2
                className="text-2xl font-bold"
                style={{
                  color: "#ffffff",
                  textShadow: glitchActive
                    ? "2px 0 #ec4899, -2px 0 #06b6d4, 0 0 20px rgba(6, 182, 212, 0.8)"
                    : "0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)",
                  letterSpacing: "0.02em"
                }}
              >
                {message}
              </h2>

              {/* 扫描线效果 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
                animate={{
                  y: ["-100%", "100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
                style={{ height: "20%" }}
              />
            </motion.div>

            {/* 副标题 - 错开时间的呼吸闪烁 */}
            <motion.p
              className="text-base text-foreground/90 font-semibold"
              animate={{
                opacity: [0.6, 1, 0.6],
                textShadow: [
                  "0 0 10px rgba(6, 182, 212, 0.4)",
                  "0 0 20px rgba(236, 72, 153, 0.6)",
                  "0 0 10px rgba(6, 182, 212, 0.4)"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8 // 错开时间
              }}
              style={{
                letterSpacing: "0.05em"
              }}
            >
              {subMessage}
            </motion.p>
          </div>
        </div>
      </div>

      {/* 底部雾气层 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pointer-events-none" />

      {/* 顶部雾气层 */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#030712]/60 via-[#030712]/30 to-transparent pointer-events-none" />
    </div>
  )
}
