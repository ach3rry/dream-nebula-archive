"use client"

import { useState } from "react"
import { Download, FileText, Image, Loader2 } from "lucide-react"

interface DreamExportProps {
  dreamId: number
  dreamContent: string
  dreamDate: string
  emotion?: {
    type: string
    score: number
    confidence: number
  }
  interpretation?: {
    summary?: string
    symbols?: Array<{
      symbol: string
      meaning: string
      mood: string
    }>
    psychological_meaning?: string
    subconscious_message?: string
    life_guidance?: string
    mental_weather?: {
      forecast: string
      temp: string
      advice: string
    }
  }
}

// 更准确的情感映射图标
const emotionIcons: Record<string, { icon: string; color: string; label: string }> = {
  "平静": { icon: "🌙", color: "#60a5fa", label: "平静" },
  "愉悦": { icon: "✨", color: "#fbbf24", label: "愉悦" },
  "忧郁": { icon: "🌫️", color: "#a78bfa", label: "忧郁" },
  "悲伤": { icon: "💧", color: "#60a5fa", label: "悲伤" },
  "恐惧": { icon: "👁️", color: "#f87171", label: "恐惧" },
  "兴奋": { icon: "🚀", color: "#fb923c", label: "兴奋" },
  "焦虑": { icon: "⚡", color: "#fbbf24", label: "焦虑" },
}

export function DreamExport({
  dreamId,
  dreamContent,
  dreamDate,
  emotion,
  interpretation
}: DreamExportProps) {
  const [exporting, setExporting] = useState(false)
  const [exportType, setExportType] = useState<"pdf" | "image" | null>(null)

  const exportAsImage = async () => {
    setExporting(true)
    setExportType("image")

    try {
      const html2canvas = (await import("html2canvas")).default

      // 获取情感信息
      const emotionData = emotion?.type ? emotionIcons[emotion.type] : emotionIcons["平静"]

      // 创建精美的梦境报告卡片
      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = "700px"
      container.style.padding = "50px"
      container.style.background = "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #172554 100%)"
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

      container.innerHTML = `
        <div style="color: #e2e8f0;">
          <!-- 标题区 -->
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
            <div style="font-size: 56px; margin-bottom: 15px; text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);">✨</div>
            <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 8px 0; background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              梦境星云档案馆
            </h1>
            <p style="margin: 0; opacity: 0.6; font-size: 13px; letter-spacing: 2px;">DREAM NEBULA ARCHIVE</p>
          </div>

          <!-- 情感信息 -->
          <div style="background: rgba(139, 92, 246, 0.1); border-radius: 20px; padding: 25px; margin-bottom: 25px; border: 2px solid rgba(139, 92, 246, 0.2);">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(96, 165, 250, 0.2)); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                ${emotionData.icon}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 12px; opacity: 0.6; margin-bottom: 4px; letter-spacing: 1px;">EMOTION</div>
                <div style="font-size: 28px; font-weight: 600; color: ${emotionData.color};">${emotionData.label}</div>
                ${emotion?.score ? `<div style="font-size: 13px; opacity: 0.7; margin-top: 4px;">强度: ${(emotion.score * 100).toFixed(0)}%</div>` : ''}
              </div>
              <div style="text-align: right; font-size: 13px; opacity: 0.6;">${dreamDate}</div>
            </div>
          </div>

          <!-- 梦境内容 -->
          <div style="background: rgba(255,255,255,0.03); border-radius: 20px; padding: 30px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 11px; opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px;">DREAM CONTENT</div>
            <div style="line-height: 2; font-size: 15px; color: #cbd5e1; white-space: pre-wrap;">${dreamContent}</div>
          </div>

          ${interpretation ? `
          <!-- 赛博周公解读 -->
          <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(96, 165, 250, 0.1)); border-radius: 20px; padding: 30px; border: 2px solid rgba(139, 92, 246, 0.3);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="font-size: 32px;">🔮</span>
              <h3 style="margin: 0; font-size: 22px; font-weight: 600; color: #a78bfa;">赛博周公解读</h3>
            </div>

            ${interpretation.mental_weather ? `
            <div style="background: rgba(0,0,0,0.2); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 48px;">${interpretation.mental_weather.forecast === "晴朗" ? "☀️" : interpretation.mental_weather.forecast === "多云转晴" ? "🌤️" : interpretation.mental_weather.forecast === "小雨" ? "🌧️" : interpretation.mental_weather.forecast === "阴天" ? "☁️" : "🌈"}</div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; opacity: 0.6; margin-bottom: 6px; letter-spacing: 1px;">MENTAL WEATHER</div>
                  <div style="font-size: 24px; font-weight: 600; margin-bottom: 6px;">${interpretation.mental_weather.forecast}</div>
                  <div style="font-size: 15px; opacity: 0.8;">${interpretation.mental_weather.temp}</div>
                </div>
              </div>
              ${interpretation.mental_weather.advice ? `
              <div style="margin-top: 15px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 10px; border-left: 3px solid #a78bfa;">
                <div style="font-size: 13px; color: #c4b5fd; line-height: 1.6;">💡 ${interpretation.mental_weather.advice}</div>
              </div>
              ` : ''}
            </div>
            ` : ''}

            ${interpretation.summary ? `
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px; letter-spacing: 2px;">SUMMARY</div>
              <div style="font-size: 14px; line-height: 1.8; color: #cbd5e1;">${interpretation.summary}</div>
            </div>
            ` : ''}

            ${interpretation.psychological_meaning ? `
            <div style="margin-bottom: 20px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 8px; letter-spacing: 2px;">PSYCHOLOGICAL MEANING</div>
              <div style="font-size: 14px; line-height: 1.8; color: #cbd5e1;">${interpretation.psychological_meaning}</div>
            </div>
            ` : ''}

            ${interpretation.life_guidance ? `
            <div style="background: rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; opacity: 0.6; margin-bottom: 8px; letter-spacing: 2px;">LIFE GUIDANCE</div>
              <div style="font-size: 14px; line-height: 1.8; color: #6ee7b7;">${interpretation.life_guidance}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- 底部 -->
          <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid rgba(148, 163, 184, 0.15);">
            <p style="margin: 0; font-size: 11px; opacity: 0.4; letter-spacing: 1px;">
              ✨ Dream Nebula Archive ✨
            </p>
            <p style="margin: 5px 0 0 0; font-size: 10px; opacity: 0.3;">
              ${new Date().toLocaleDateString("zh-CN", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      `

      document.body.appendChild(container)

      const canvas = await html2canvas(container, {
        logging: false,
        useCORS: true,
        scale: 2, // 高清
        backgroundColor: "#0f172a"
      } as any)

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `梦境报告_${dreamId}_${Date.now()}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
        document.body.removeChild(container)
      })
    } catch (error) {
      console.error("Export failed:", error)
      alert("导出失败，请重试")
    } finally {
      setExporting(false)
      setExportType(null)
    }
  }

  const exportAsPDF = async () => {
    setExporting(true)
    setExportType("pdf")

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      // PDF导出：完整的梦境分析报告（包含梦境内容+分析结果）
      const emotionData = emotion?.type ? emotionIcons[emotion.type] : emotionIcons["平静"]

      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = "800px"
      container.style.padding = "60px 50px"
      container.style.background = "linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)"
      container.style.fontFamily = "'Microsoft YaHei', 'SimHei', 'PingFang SC', sans-serif"

      container.innerHTML = `
        <div style="color: #e2e8f0;">
          <!-- 报告标题 -->
          <div style="text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 2px solid rgba(139, 92, 246, 0.3);">
            <div style="font-size: 64px; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));">🔮</div>
            <h1 style="font-size: 42px; margin: 0 0 10px 0; background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">
              梦境分析报告
            </h1>
            <p style="margin: 0; font-size: 14px; opacity: 0.6; letter-spacing: 3px;">DREAM ANALYSIS REPORT</p>
          </div>

          <!-- 梦境基础信息 -->
          <div style="background: rgba(139, 92, 246, 0.08); border-radius: 20px; padding: 30px; margin-bottom: 40px; border-left: 4px solid #a78bfa;">
            <div style="font-size: 11px; opacity: 0.5; margin-bottom: 15px; letter-spacing: 2px;">DREAM INFORMATION</div>
            <div style="display: flex; align-items: start; gap: 20px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(96, 165, 250, 0.2)); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 36px; flex-shrink: 0;">
                ${emotionData.icon}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 13px; opacity: 0.6; margin-bottom: 8px;">主导情感</div>
                <div style="font-size: 28px; font-weight: 600; color: ${emotionData.color}; margin-bottom: 10px;">${emotionData.label}</div>
                ${emotion?.score ? `<div style="font-size: 14px; opacity: 0.7;">强度: ${(emotion.score * 100).toFixed(0)}%</div>` : ''}
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                <div style="font-size: 12px; opacity: 0.5; margin-bottom: 5px;">分析日期</div>
                <div style="font-size: 14px; opacity: 0.8;">${dreamDate}</div>
                <div style="font-size: 12px; opacity: 0.5; margin-top: 15px; margin-bottom: 5px;">梦境编号</div>
                <div style="font-size: 14px; opacity: 0.8;">#${dreamId}</div>
              </div>
            </div>
          </div>

          <!-- 完整梦境内容 -->
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 20px; padding: 35px; margin-bottom: 40px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="font-size: 11px; opacity: 0.5; margin-bottom: 20px; letter-spacing: 2px;">DREAM CONTENT</div>
            <div style="font-size: 16px; line-height: 2; color: #e2e8f0; white-space: pre-wrap;">
              ${dreamContent}
            </div>
          </div>

          ${interpretation ? `
          <!-- 赛博周公解读报告 -->
          <div style="background: rgba(30, 30, 50, 0.6); border-radius: 24px; padding: 40px; border: 1px solid rgba(139, 92, 246, 0.2);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 35px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="font-size: 36px; background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">✨</span>
              <div>
                <h2 style="margin: 0; font-size: 28px; font-weight: 600; background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">赛博周公解读</h2>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.6;">Cyber Duke of Zhou AI Interpretation</p>
              </div>
            </div>

            ${interpretation.mental_weather ? `
            <!-- 心灵天气预报 -->
            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(96, 165, 250, 0.08)); border-radius: 18px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(139, 92, 246, 0.2);">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 15px; letter-spacing: 2px;">MENTAL WEATHER FORECAST</div>
              <div style="display: flex; align-items: center; gap: 30px;">
                <div style="font-size: 72px; filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));">
                  ${interpretation.mental_weather.forecast === "晴朗" ? "☀️" : interpretation.mental_weather.forecast === "多云转晴" ? "🌤️" : interpretation.mental_weather.forecast === "小雨" ? "🌧️" : interpretation.mental_weather.forecast === "阵雨" ? "⛈️" : interpretation.mental_weather.forecast === "雷暴" ? "⛈️" : interpretation.mental_weather.forecast === "晴间多云" ? "⛅" : interpretation.mental_weather.forecast === "阴天" ? "☁️" : interpretation.mental_weather.forecast === "局部阴天" ? "🌥️" : "🌈"}
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 36px; font-weight: 700; margin-bottom: 12px; color: #e2e8f0;">${interpretation.mental_weather.forecast}</div>
                  <div style="font-size: 18px; opacity: 0.8; margin-bottom: 15px; color: #cbd5e1;">${interpretation.mental_weather.temp}</div>
                  <div style="background: rgba(139, 92, 246, 0.15); border-radius: 12px; padding: 15px 20px; border-left: 3px solid #a78bfa;">
                    <div style="font-size: 14px; color: #c4b5fd; line-height: 1.7;">💡 ${interpretation.mental_weather.advice}</div>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}

            ${interpretation.summary ? `
            <!-- 梦境概要 -->
            <div style="margin-bottom: 30px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px;">DREAM SUMMARY</div>
              <div style="background: rgba(255,255,255,0.03); border-radius: 14px; padding: 25px; line-height: 1.9; font-size: 15px; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.05);">
                ${interpretation.summary}
              </div>
            </div>
            ` : ''}

            ${interpretation.symbols && interpretation.symbols.length > 0 ? `
            <!-- 象征符号 -->
            <div style="margin-bottom: 30px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px;">DISCOVERED SYMBOLS</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                ${interpretation.symbols.map(symbol => `
                  <div style="background: rgba(139, 92, 246, 0.08); border-radius: 12px; padding: 20px; border: 1px solid rgba(139, 92, 246, 0.2);">
                    <div style="font-size: 24px; margin-bottom: 10px;">${symbol.mood === "平静" ? "🌙" : symbol.mood === "愉悦" ? "✨" : symbol.mood === "忧郁" ? "🌫️" : symbol.mood === "悲伤" ? "💧" : symbol.mood === "恐惧" ? "👁️" : symbol.mood === "兴奋" ? "🚀" : symbol.mood === "焦虑" ? "⚡" : "🔮"}</div>
                    <div style="font-size: 18px; font-weight: 600; color: #a78bfa; margin-bottom: 8px;">${symbol.symbol}</div>
                    <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">${symbol.meaning}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            ${interpretation.psychological_meaning ? `
            <!-- 心理学解读 -->
            <div style="margin-bottom: 30px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px;">PSYCHOLOGICAL ANALYSIS</div>
              <div style="background: rgba(96, 165, 250, 0.08); border-radius: 14px; padding: 25px; line-height: 1.9; font-size: 15px; color: #cbd5e1; border-left: 3px solid #60a5fa;">
                ${interpretation.psychological_meaning}
              </div>
            </div>
            ` : ''}

            ${interpretation.subconscious_message ? `
            <!-- 潜意识信息 -->
            <div style="margin-bottom: 30px;">
              <div style="font-size: 11px; opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px;">SUBCONSCIOUS MESSAGE</div>
              <div style="background: rgba(168, 85, 247, 0.08); border-radius: 14px; padding: 25px; line-height: 1.9; font-size: 15px; color: #cbd5e1; border-left: 3px solid #a855f7;">
                ${interpretation.subconscious_message}
              </div>
            </div>
            ` : ''}

            ${interpretation.life_guidance ? `
            <!-- 生活指引 -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.08)); border-radius: 18px; padding: 30px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <div style="font-size: 11px; opacity: 0.6; margin-bottom: 15px; letter-spacing: 2px; color: #6ee7b7;">LIFE GUIDANCE</div>
              <div style="font-size: 16px; line-height: 2; color: #6ee7b7; font-weight: 500;">
                ${interpretation.life_guidance}
              </div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- 报告页脚 -->
          <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.08);">
            <p style="margin: 0; font-size: 13px; opacity: 0.4; letter-spacing: 1px;">
              🔮 梦境星云档案馆 • Dream Nebula Archive
            </p>
            <p style="margin: 8px 0 0 0; font-size: 11px; opacity: 0.3;">
              Generated by AI • ${new Date().toLocaleDateString("zh-CN", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      `

      document.body.appendChild(container)

      const canvas = await html2canvas(container, {
        logging: false,
        useCORS: true,
        scale: 2
      } as any)

      document.body.removeChild(container)

      // 创建 PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`梦境分析报告_${dreamId}_${Date.now()}.pdf`)
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("PDF导出失败，请重试")
    } finally {
      setExporting(false)
      setExportType(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportAsImage}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50"
        title="导出精美报告图片"
      >
        {exporting && exportType === "image" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Image className="w-4 h-4" />
        )}
        <span className="text-sm font-bold">图片</span>
      </button>

      <button
        onClick={exportAsPDF}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors disabled:opacity-50"
        title="导出 PDF 报告"
      >
        {exporting && exportType === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="text-sm font-bold">PDF</span>
      </button>
    </div>
  )
}
