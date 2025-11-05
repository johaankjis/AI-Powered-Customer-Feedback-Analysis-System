import { type NextRequest, NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"

// PATCH /api/requirements/[id] - Update requirement
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const requirementId = Number.parseInt(id)
    const body = await request.json()

    const requirement = mockData.requirements.find((r) => r.id === requirementId)

    if (!requirement) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
    }

    // Update fields
    if (body.title) requirement.title = body.title
    if (body.description) requirement.description = body.description
    if (body.status) requirement.status = body.status
    if (body.priority !== undefined) requirement.priority = body.priority
    if (body.target_date !== undefined) requirement.target_date = body.target_date

    requirement.updated_at = new Date().toISOString()

    return NextResponse.json({
      message: "Requirement updated successfully",
      data: requirement,
    })
  } catch (error) {
    console.error("[v0] Error updating requirement:", error)
    return NextResponse.json({ error: "Failed to update requirement" }, { status: 500 })
  }
}

// DELETE /api/requirements/[id] - Delete requirement
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const requirementId = Number.parseInt(id)

    const index = mockData.requirements.findIndex((r) => r.id === requirementId)

    if (index === -1) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
    }

    mockData.requirements.splice(index, 1)

    return NextResponse.json({
      message: "Requirement deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting requirement:", error)
    return NextResponse.json({ error: "Failed to delete requirement" }, { status: 500 })
  }
}
