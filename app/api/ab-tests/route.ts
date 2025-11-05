import { type NextRequest, NextResponse } from "next/server"
import { mockData } from "@/lib/mock-data"
import type { ABTest } from "@/lib/types"

// GET /api/ab-tests - Get all A/B tests
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let tests = [...mockData.abTests]

    // Filter by status if provided
    if (status) {
      tests = tests.filter((t) => t.status === status)
    }

    // Sort by created_at descending
    tests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ data: tests })
  } catch (error) {
    console.error("[v0] Error fetching A/B tests:", error)
    return NextResponse.json({ error: "Failed to fetch A/B tests" }, { status: 500 })
  }
}

// POST /api/ab-tests - Create new A/B test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { test_name, description, hypothesis, variant_a_name, variant_b_name } = body

    if (!test_name || !hypothesis) {
      return NextResponse.json({ error: "Missing required fields: test_name, hypothesis" }, { status: 400 })
    }

    const newTest: ABTest = {
      id: mockData.abTests.length + 1,
      test_name,
      description: description || "",
      hypothesis,
      variant_a_name: variant_a_name || "Control",
      variant_b_name: variant_b_name || "Treatment",
      status: "draft",
      start_date: null,
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockData.abTests.push(newTest)

    return NextResponse.json({ message: "A/B test created successfully", data: newTest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating A/B test:", error)
    return NextResponse.json({ error: "Failed to create A/B test" }, { status: 500 })
  }
}
