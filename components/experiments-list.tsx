"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, CheckCircle, Eye } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ExperimentsList() {
  const { data, error, isLoading, mutate } = useSWR("/api/ab-tests", fetcher)

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")
      mutate()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      alert("Failed to update experiment status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading experiments...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load experiments</p>
      </div>
    )
  }

  const experiments = data.data

  if (experiments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No experiments yet</p>
          <p className="text-sm text-muted-foreground">Create your first A/B test to start comparing feedback</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {experiments.map((experiment: any) => (
        <Card key={experiment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{experiment.test_name}</CardTitle>
                  <Badge variant="secondary" className={getStatusColor(experiment.status)}>
                    {experiment.status}
                  </Badge>
                </div>
                <CardDescription className="text-pretty">{experiment.hypothesis}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experiment.description && (
                <p className="text-sm text-muted-foreground text-pretty">{experiment.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Variant A:</span>{" "}
                  <span className="font-medium">{experiment.variant_a_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Variant B:</span>{" "}
                  <span className="font-medium">{experiment.variant_b_name}</span>
                </div>
              </div>

              {experiment.start_date && (
                <div className="text-sm text-muted-foreground">
                  Started: {new Date(experiment.start_date).toLocaleDateString()}
                  {experiment.end_date && <> • Ended: {new Date(experiment.end_date).toLocaleDateString()}</>}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Link href={`/experiments/${experiment.id}`}>
                  <Button size="sm" variant="default">
                    <Eye className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </Link>

                {experiment.status === "draft" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(experiment.id, "running")}>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                )}

                {experiment.status === "running" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(experiment.id, "paused")}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(experiment.id, "completed")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </>
                )}

                {experiment.status === "paused" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(experiment.id, "running")}>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
