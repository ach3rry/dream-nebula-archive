import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001"

// Default user ID for demo (in production, this would come from authentication)
const DEFAULT_USER_ID = 1

// GET /api/dreams - 获取所有梦境
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id") || String(DEFAULT_USER_ID)

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
      throw new Error(`Backend responded with ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    // Return just the dreams array for simpler frontend handling
    return NextResponse.json(data.dreams || [])
  } catch (error) {
    console.error("Error fetching dreams:", error)
    return NextResponse.json(
      { error: "Failed to fetch dreams", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
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
      throw new Error(`Backend responded with ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating dream:", error)
    return NextResponse.json(
      { error: "Failed to create dream", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
