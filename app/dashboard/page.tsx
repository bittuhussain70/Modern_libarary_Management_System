"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === "admin" || user.role === "librarian") {
        router.push("/admin/dashboard")
      } else if (user.role === "student") {
        router.push("/student/dashboard")
      } else {
        router.push("/login")
      }
    } else if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return null
}
