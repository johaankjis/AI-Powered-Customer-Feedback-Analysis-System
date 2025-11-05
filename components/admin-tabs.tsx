"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedbackManagement } from "@/components/feedback-management"
import { RequirementsManagement } from "@/components/requirements-management"
import { InsightsManagement } from "@/components/insights-management"

export function AdminTabs() {
  return (
    <Tabs defaultValue="feedback" className="space-y-6">
      <TabsList>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="requirements">Requirements</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="feedback" className="space-y-4">
        <FeedbackManagement />
      </TabsContent>

      <TabsContent value="requirements" className="space-y-4">
        <RequirementsManagement />
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <InsightsManagement />
      </TabsContent>
    </Tabs>
  )
}
