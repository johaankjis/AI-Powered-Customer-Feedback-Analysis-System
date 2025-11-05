import { Suspense } from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminTabs } from "@/components/admin-tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <AdminTabs />
        </Suspense>
      </main>
    </div>
  )
}
