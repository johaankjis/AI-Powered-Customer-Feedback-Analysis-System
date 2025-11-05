import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Admin Management</h1>
            <p className="mt-1 text-muted-foreground text-pretty">
              Manage feedback, requirements, and system configuration
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
