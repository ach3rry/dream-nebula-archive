import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

// Default user ID for demo (in production, this would come from authentication)
const DEFAULT_USER_ID = 1

// GET /api/dreams - 获取所有梦境
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id") || String(DEFAULT_USER_ID)

    console.log(`[API] Fetching dreams from backend: ${BACKEND_URL}/api/dreams?user_id=${userId}`)

    const response = await fetch(
      `${BACKEND_URL}/api/dreams?user_id=${userId}&page=1&page_size=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API] Backend error: ${response.status} - ${errorText}`)
      // Return empty array on error to prevent frontend crashes
      return NextResponse.json([])
    }

    const data = await response.json()
    console.log(`[API] Backend response structure:`, {
      hasDreams: 'dreams' in data,
      dreamsIsArray: Array.isArray(data.dreams),
      dreamsLength: data.dreams?.length,
      total: data.total
    })

    // Return just the dreams array for simpler frontend handling
    const dreams = Array.isArray(data.dreams) ? data.dreams : []
    return NextResponse.json(dreams)
  } catch (error) {
    console.error("[API] Error fetching dreams:", error)
    // Return empty array on error to prevent frontend crashes
    return NextResponse.json([])
  }
}

// POST /api/dreams - 创建新梦境
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Add default user_id if not provided
    const dreamData = {
      user_id: DEFAULT_USER_ID,
      content: body.content,
      is_private: true,
    }

    const response = await fetch(`${BACKEND_URL}/api/dreams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dreamData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API] Backend error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: "Failed to create dream", details: errorText },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API] Error creating dream:", error)
    return NextResponse.json(
      { error: "Failed to create dream", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
