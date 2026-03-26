"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  vx: number
  vy: number
  color: "cyan" | "magenta" | "purple" | "white"
}

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let stars: Star[] = []
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      // 更多星星
      const starCount = Math.floor((canvas.width * canvas.height) / 3000)
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        color: ["cyan", "magenta", "purple", "white"][
          Math.floor(Math.random() * 4)
        ] as "cyan" | "magenta" | "purple" | "white",
      }))
    }

    const createParticle = (x: number, y: number) => {
      if (particles.length < 50) {
        particles.push({
          x,
          y,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
        })
      }
    }

    const getStarColor = (star: Star, opacity: number) => {
      const colors = {
        cyan: `rgba(0, 245, 255, ${opacity})`,
        magenta: `rgba(255, 0, 255, ${opacity})`,
        purple: `rgba(168, 85, 247, ${opacity})`,
        white: `rgba(255, 255, 255, ${opacity})`,
      }
      return colors[star.color]
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制星尘粒子
      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.005
        particle.opacity = particle.opacity * particle.life

        if (particle.life <= 0) {
          particles.splice(index, 1)
          return
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.5})`
        ctx.fill()
      })

      // 绘制星星
      stars.forEach((star) => {
        // 缓慢移动
        star.x += star.vx
        star.y += star.vy

        // 边界检查，循环移动
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // 闪烁效果
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.4 + 0.6
        const opacity = star.opacity * twinkle

        // 创建光晕渐变
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 4
        )

        const baseColor = getStarColor(star, opacity)
        gradient.addColorStop(0, baseColor)
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity * 0.4})`)
        gradient.addColorStop(1, "transparent")

        // 绘制光晕
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // 绘制核心
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // 随机生成粒子
        if (Math.random() > 0.999) {
          createParticle(star.x, star.y)
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener("resize", resize)
    draw(0)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
