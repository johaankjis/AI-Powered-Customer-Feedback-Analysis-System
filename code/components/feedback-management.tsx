"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeedbackManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  const { data, error, isLoading } = useSWR("/api/feedback?limit=100", fetcher)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading feedback...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load feedback</p>
      </div>
    )
  }

  let filteredFeedback = data.data

  // Apply filters
  if (searchTerm) {
    filteredFeedback = filteredFeedback.filter(
      (f: any) =>
        f.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.customer_id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  if (sentimentFilter !== "all") {
    filteredFeedback = filteredFeedback.filter((f: any) => f.analysis?.sentiment === sentimentFilter)
  }

  if (sourceFilter !== "all") {
    filteredFeedback = filteredFeedback.filter((f: any) => f.source === sourceFilter)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Filters</CardTitle>
          <CardDescription>Search and filter customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback or customer ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="survey">Survey</SelectItem>
                <SelectItem value="support_ticket">Support Ticket</SelectItem>
                <SelectItem value="app_review">App Review</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredFeedback.length} of {data.data.length} feedback items
      </div>

      <div className="space-y-4">
        {filteredFeedback.map((feedback: any) => (
          <Card key={feedback.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{feedback.source}</Badge>
                    {feedback.analysis && (
                      <Badge variant="secondary" className={getSentimentColor(feedback.analysis.sentiment)}>
                        {feedback.analysis.sentiment}
                      </Badge>
                    )}
                    <Badge variant="secondary">Rating: {feedback.rating}/5</Badge>
                  </div>
                  <CardDescription>
                    Customer: {feedback.customer_id} • Product: {feedback.product_id}
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pretty mb-4">{feedback.feedback_text}</p>

              {feedback.analysis && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <div className="text-xs text-muted-foreground">Topics:</div>
                    {feedback.analysis.topics.map((topic: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  {feedback.analysis.feature_mentions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <div className="text-xs text-muted-foreground">Features:</div>
                      {feedback.analysis.feature_mentions.map((feature: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Sentiment Score: {feedback.analysis.sentiment_score}</span>
                    <span>Urgency: {feedback.analysis.urgency_score}/10</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
