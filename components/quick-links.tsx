import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, FlaskConical, Settings } from "lucide-react"
import Link from "next/link"

export function QuickLinks() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/experiments">
            <Button variant="outline">
              <FlaskConical className="mr-2 h-4 w-4" />
              A/B Tests
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
