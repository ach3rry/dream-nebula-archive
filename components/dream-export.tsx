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
  }
  interpretation?: {
    summary?: string
    psychological_meaning?: string
    life_guidance?: string
    mental_weather?: {
      forecast: string
      temp: string
      advice: string
    }
  }
}

const emotionIcons: Record<string, string> = {
  "平静": "🌙", "愉悦": "✨", "忧郁": "🌫️",
  "悲伤": "💧", "恐惧": "👁️", "兴奋": "🚀", "焦虑": "⚡"
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
      // 动态导入 html2canvas
      const html2canvas = (await import("html2canvas")).default

      // 创建导出容器
      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = "800px"
      container.style.padding = "40px"
      container.style.background = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      container.style.fontFamily = "system-ui, sans-serif"

      const emotionIcon = emotion?.type ? emotionIcons[emotion.type] : "🌙"
      const emotionLabel = emotion?.type || "平静"

      container.innerHTML = `
        <div style="color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; background: linear-gradient(90deg, #00f5ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              梦境星云档案馆
            </h1>
            <p style="margin: 0; opacity: 0.7; font-size: 14px;">Dream Nebula Archive</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 30px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <span style="font-size: 36px;">${emotionIcon}</span>
              <div>
                <div style="font-size: 14px; opacity: 0.7;">情感</div>
                <div style="font-size: 18px; font-weight: 500;">${emotionLabel}</div>
              </div>
              <div style="margin-left: auto; font-size: 12px; opacity: 0.7;">${dreamDate}</div>
            </div>

            <div style="line-height: 1.8; font-size: 16px; white-space: pre-wrap;">${dreamContent}</div>
          </div>

          ${interpretation ? `
          <div style="background: rgba(0,245,255,0.1); border-radius: 16px; padding: 30px; border: 1px solid rgba(0,245,255,0.2);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <span style="font-size: 24px;">🔮</span>
              <h3 style="margin: 0; font-size: 20px;">赛博周公解读</h3>
            </div>

            ${interpretation.mental_weather ? `
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">心灵天气预报</div>
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="font-size: 32px;">${interpretation.mental_weather.forecast === "晴朗" ? "☀️" : interpretation.mental_weather.forecast === "多云转晴" ? "🌤️" : interpretation.mental_weather.forecast === "小雨" ? "🌧️" : "☁️"}</div>
                <div>
                  <div style="font-size: 18px; font-weight: 500;">${interpretation.mental_weather.forecast}</div>
                  <div style="font-size: 14px; opacity: 0.7;">${interpretation.mental_weather.temp}</div>
                </div>
              </div>
              <div style="margin-top: 10px; font-size: 14px; opacity: 0.8;">${interpretation.mental_weather.advice}</div>
            </div>
            ` : ''}

            ${interpretation.summary ? `
            <div style="margin-bottom: 15px;">
              <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">梦境概要</div>
              <div style="font-size: 14px; line-height: 1.6;">${interpretation.summary}</div>
            </div>
            ` : ''}

            ${interpretation.life_guidance ? `
            <div style="background: rgba(0,245,255,0.1); border-radius: 8px; padding: 15px; margin-top: 15px;">
              <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">生活指引</div>
              <div style="font-size: 14px; color: #00f5ff;">${interpretation.life_guidance}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0; font-size: 12px; opacity: 0.5;">
              Generated by Dream Nebula Archive • ${new Date().toLocaleDateString("zh-CN")}
            </p>
          </div>
        </div>
      `

      document.body.appendChild(container)

      // 使用 html2canvas 捕获
      const canvas = await html2canvas(container, {
        backgroundColor: "#1a1a2e",
        scale: 2, // 高清导出
        logging: false,
        useCORS: true
      })

      // 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `梦境_${dreamId}_${new Date().getTime()}.png`
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
      // 动态导入 jsPDF
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      const emotionIcon = emotion?.type ? emotionIcons[emotion.type] : "🌙"
      const emotionLabel = emotion?.type || "平静"

      // 添加中文字体支持需要额外配置，这里使用英文
      doc.setFontSize(20)
      doc.text("Dream Nebula Archive", 105, 20, { align: "center" })

      doc.setFontSize(12)
      doc.text(`Dream ID: ${dreamId}`, 105, 30, { align: "center" })
      doc.text(`Date: ${dreamDate}`, 105, 36, { align: "center" })

      // 分隔线
      doc.setLineWidth(0.5)
      doc.line(20, 42, 190, 42)

      // 情感信息
      doc.setFontSize(14)
      doc.text(`Emotion: ${emotionLabel}`, 25, 55)

      // 梦境内容
      doc.setFontSize(12)
      const contentLines = doc.splitTextToSize(dreamContent, 160)
      let yPosition = 70
      contentLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 25, yPosition)
        yPosition += 7
      })

      // 解读信息
      if (interpretation) {
        if (yPosition > 240) {
          doc.addPage()
          yPosition = 20
        }

        yPosition += 15
        doc.setFontSize(14)
        doc.text("Dream Interpretation", 25, yPosition)
        yPosition += 10

        if (interpretation.summary) {
          doc.setFontSize(10)
          doc.text("Summary:", 25, yPosition)
          yPosition += 7
          const summaryLines = doc.splitTextToSize(interpretation.summary, 160)
          summaryLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, 25, yPosition)
            yPosition += 6
          })
        }

        if (interpretation.mental_weather) {
          yPosition += 10
          doc.text(`Mental Weather: ${interpretation.mental_weather.forecast} (${interpretation.mental_weather.temp})`, 25, yPosition)
          yPosition += 7
          doc.text(`Advice: ${interpretation.mental_weather.advice}`, 25, yPosition)
        }
      }

      // 下载
      doc.save(`dream_${dreamId}_${new Date().getTime()}.pdf`)
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
        title="导出为图片"
      >
        {exporting && exportType === "image" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Image className="w-4 h-4" />
        )}
        <span className="text-sm">图片</span>
      </button>

      <button
        onClick={exportAsPDF}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors disabled:opacity-50"
        title="导出为 PDF"
      >
        {exporting && exportType === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="text-sm">PDF</span>
      </button>
    </div>
  )
}
