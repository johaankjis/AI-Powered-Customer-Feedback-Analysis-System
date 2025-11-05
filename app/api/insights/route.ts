import { type NextRequest, NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"

// GET /api/insights - Get actionable insights
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let insights = [...mockData.insights]

    // Apply filters
    if (status) {
      insights = insights.filter((i) => i.status === status)
    }
    if (type) {
      insights = insights.filter((i) => i.insight_type === type)
    }

    // Sort by priority descending, then by created_at descending
    insights.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json({ data: insights })
  } catch (error) {
    console.error("[v0] Error fetching insights:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}

// PATCH /api/insights/[id] - Update insight status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields: id, status" }, { status: 400 })
    }

    const validStatuses = ["new", "reviewed", "actioned", "dismissed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(", ")}` }, { status: 400 })
    }

    const insight = mockData.insights.find((i) => i.id === id)
    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    insight.status = status
    insight.updated_at = new Date().toISOString()

    return NextResponse.json({
      message: "Insight updated successfully",
      data: insight,
    })
  } catch (error) {
    console.error("[v0] Error updating insight:", error)
    return NextResponse.json({ error: "Failed to update insight" }, { status: 500 })
  }
}
