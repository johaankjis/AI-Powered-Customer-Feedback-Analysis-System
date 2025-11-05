"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface CreateExperimentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateExperimentDialog({ open, onOpenChange }: CreateExperimentDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    test_name: "",
    description: "",
    hypothesis: "",
    variant_a_name: "Control",
    variant_b_name: "Treatment",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/ab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create experiment")

      onOpenChange(false)
      setFormData({
        test_name: "",
        description: "",
        hypothesis: "",
        variant_a_name: "Control",
        variant_b_name: "Treatment",
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating experiment:", error)
      alert("Failed to create experiment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Experiment</DialogTitle>
            <DialogDescription>Set up a new A/B test to compare feedback between variants</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test_name">Experiment Name *</Label>
              <Input
                id="test_name"
                value={formData.test_name}
                onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                placeholder="e.g., New Onboarding Flow"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hypothesis">Hypothesis *</Label>
              <Textarea
                id="hypothesis"
                value={formData.hypothesis}
                onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                placeholder="What do you expect to happen?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about the experiment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant_a_name">Variant A Name</Label>
                <Input
                  id="variant_a_name"
                  value={formData.variant_a_name}
                  onChange={(e) => setFormData({ ...formData, variant_a_name: e.target.value })}
                  placeholder="Control"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant_b_name">Variant B Name</Label>
                <Input
                  id="variant_b_name"
                  value={formData.variant_b_name}
                  onChange={(e) => setFormData({ ...formData, variant_b_name: e.target.value })}
                  placeholder="Treatment"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Experiment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
