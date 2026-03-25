/**
 * API Client - 智能切换真实 API 和 Mock 数据
 * 根据环境变量 NEXT_PUBLIC_DEMO_MODE 决定使用哪种数据源
 */

import { mockDreams, mockInterpretations, mockAnalyzeEmotion, mockAnalyzeDream } from './mock-data'

// 检查是否启用 Demo 模式
const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// 真实 API 基础 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface EmotionAnalysis {
  emotion_type: string
  emotion_score: number
  confidence: number
  keywords?: string[]
}

export interface DreamInterpretation {
  summary: string
  symbols: Array<{
    symbol: string
    meaning: string
    mood: string
  }>
  psychological_meaning: string
  subconscious_message: string
  life_guidance: string
  mental_weather: {
    forecast: string
    temp: string
    advice: string
  }
}

export interface Dream {
  id: number
  content: string
  title?: string
  emotion?: {
    type: string
    score: number
    confidence: number
  }
  keywords?: string[]
  created_at: string
  updated_at: string
}

/**
 * 获取所有梦境
 */
export async function fetchDreams(userId: number = 1): Promise<Dream[]> {
  if (IS_DEMO_MODE) {
    console.log('[Demo Mode] Using mock dreams data')
    return mockDreams
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dreams?user_id=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch dreams')
    const data = await response.json()
    // 后端返回的是 { total, dreams, page, page_size } 格式
    return data.dreams || []
  } catch (error) {
    console.error('[API Error] Failed to fetch dreams:', error)
    // 失败时回退到 mock 数据
    console.log('[Fallback] Using mock dreams data')
    return mockDreams
  }
}

/**
 * 获取单个梦境详情
 */
export async function fetchDream(dreamId: number): Promise<Dream | null> {
  if (IS_DEMO_MODE) {
    console.log(`[Demo Mode] Using mock dream data for id: ${dreamId}`)
    const dream = mockDreams.find(d => d.id === dreamId)
    return dream || null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dreams/${dreamId}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch dream')
    }
    return await response.json()
  } catch (error) {
    console.error('[API Error] Failed to fetch dream:', error)
    // 失败时尝试从 mock 数据获取
    const dream = mockDreams.find(d => d.id === dreamId)
    if (dream) {
      console.log('[Fallback] Using mock dream data')
      return dream
    }
    return null
  }
}

/**
 * 创建新梦境
 */
export async function createDream(content: string, userId: number = 1): Promise<Dream | null> {
  if (IS_DEMO_MODE) {
    console.log('[Demo Mode] Simulating dream creation')
    // Demo 模式下模拟创建，返回一个新梦境
    const newDream: Dream = {
      id: mockDreams.length + 1 + Math.floor(Math.random() * 1000),
      content,
      emotion: {
        type: "平静",
        score: 0.5,
        confidence: 0.5
      },
      keywords: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return newDream
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dreams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, user_id: userId })
    })
    if (!response.ok) throw new Error('Failed to create dream')
    return await response.json()
  } catch (error) {
    console.error('[API Error] Failed to create dream:', error)
    return null
  }
}

/**
 * 分析情感
 */
export async function analyzeEmotion(content: string): Promise<EmotionAnalysis> {
  if (IS_DEMO_MODE) {
    console.log('[Demo Mode] Using mock emotion analysis')
    return await mockAnalyzeEmotion(content)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/emotion/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    if (!response.ok) throw new Error('Failed to analyze emotion')
    return await response.json()
  } catch (error) {
    console.error('[API Error] Failed to analyze emotion:', error)
    console.log('[Fallback] Using mock emotion analysis')
    return await mockAnalyzeEmotion(content)
  }
}

/**
 * 解读梦境
 */
export async function interpretDream(
  dreamContent: string,
  emotionType: string,
  emotionScore: number
): Promise<DreamInterpretation> {
  if (IS_DEMO_MODE) {
    console.log('[Demo Mode] Using mock dream interpretation')
    return await mockAnalyzeDream(dreamContent, emotionType, emotionScore)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/interpretation/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dream_content: dreamContent,
        emotion_type: emotionType,
        emotion_score: emotionScore
      })
    })
    if (!response.ok) throw new Error('Failed to interpret dream')
    return await response.json()
  } catch (error) {
    console.error('[API Error] Failed to interpret dream:', error)
    console.log('[Fallback] Using mock dream interpretation')
    return await mockAnalyzeDream(dreamContent, emotionType, emotionScore)
  }
}

/**
 * 删除梦境
 */
export async function deleteDream(dreamId: number): Promise<boolean> {
  if (IS_DEMO_MODE) {
    console.log(`[Demo Mode] Simulating dream deletion for id: ${dreamId}`)
    return true
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dreams/${dreamId}`, {
      method: 'DELETE'
    })
    return response.ok
  } catch (error) {
    console.error('[API Error] Failed to delete dream:', error)
    return false
  }
}

/**
 * 更新梦境
 */
export async function updateDream(dreamId: number, content: string): Promise<Dream | null> {
  if (IS_DEMO_MODE) {
    console.log(`[Demo Mode] Simulating dream update for id: ${dreamId}`)
    const dream = mockDreams.find(d => d.id === dreamId)
    if (dream) {
      return { ...dream, content, updated_at: new Date().toISOString() }
    }
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dreams/${dreamId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    if (!response.ok) throw new Error('Failed to update dream')
    return await response.json()
  } catch (error) {
    console.error('[API Error] Failed to update dream:', error)
    return null
  }
}

// 导出模式检查
export { IS_DEMO_MODE }
