import { type NextRequest, NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"
import type { ProductRequirement } from "@/lib/types"

// GET /api/requirements - Get all product requirements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let requirements = [...mockData.requirements]

    // Filter by status if provided
    if (status) {
      requirements = requirements.filter((r) => r.status === status)
    }

    // Sort by priority descending, then by created_at descending
    requirements.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json({ data: requirements })
  } catch (error) {
    console.error("[v0] Error fetching requirements:", error)
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 })
  }
}

// POST /api/requirements - Create new requirement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, target_date } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields: title, description" }, { status: 400 })
    }

    const newRequirement: ProductRequirement = {
      id: mockData.requirements.length + 1,
      title,
      description,
      status: "draft",
      priority: priority || 5,
      target_date: target_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockData.requirements.push(newRequirement)

    return NextResponse.json({ message: "Requirement created successfully", data: newRequirement }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating requirement:", error)
    return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 })
  }
}
