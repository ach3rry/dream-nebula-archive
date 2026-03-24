import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001"

// GET /api/dreams/[id] - 获取单个梦境
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const response = await fetch(`${BACKEND_URL}/api/dreams/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Dream not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching dream:", error)
    return NextResponse.json(
      { error: "Failed to fetch dream", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// PUT /api/dreams/[id] - 更新梦境
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/dreams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Dream not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating dream:", error)
    return NextResponse.json(
      { error: "Failed to update dream", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// DELETE /api/dreams/[id] - 删除梦境
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const response = await fetch(`${BACKEND_URL}/api/dreams/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Dream not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting dream:", error)
    return NextResponse.json(
      { error: "Failed to delete dream", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
