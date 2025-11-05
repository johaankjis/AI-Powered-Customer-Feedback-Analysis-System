"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import useSWR from "swr"
import { useState } from "react"
import { CreateRequirementDialog } from "@/components/create-requirement-dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RequirementsManagement() {
  const [showDialog, setShowDialog] = useState(false)
  const { data, error, isLoading, mutate } = useSWR("/api/requirements", fetcher)

  const deleteRequirement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete requirement")
      mutate()
    } catch (error) {
      console.error("[v0] Error deleting requirement:", error)
      alert("Failed to delete requirement")
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")
      mutate()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      alert("Failed to update requirement status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading requirements...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load requirements</p>
      </div>
    )
  }

  const requirements = data.data

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "text-red-600"
    if (priority >= 5) return "text-yellow-600"
    return "text-blue-600"
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Product Requirements</h3>
          <p className="text-sm text-muted-foreground">Manage and track product requirements</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Requirement
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No requirements yet</p>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Requirement
              </Button>
            </CardContent>
          </Card>
        ) : (
          requirements.map((req: any) => (
            <Card key={req.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{req.title}</CardTitle>
                      <Badge variant="secondary" className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-pretty">{req.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Priority</div>
                    <div className={`text-2xl font-bold ${getPriorityColor(req.priority)}`}>{req.priority}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {req.target_date && <>Target: {new Date(req.target_date).toLocaleDateString()}</>}
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === "draft" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, "active")}>
                        Activate
                      </Button>
                    )}
                    {req.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, "completed")}>
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteRequirement(req.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateRequirementDialog open={showDialog} onOpenChange={setShowDialog} onSuccess={mutate} />
    </>
  )
}
