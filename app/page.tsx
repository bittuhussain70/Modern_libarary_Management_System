"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2, BookOpen } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        if (user.role === "admin" || user.role === "librarian") {
          router.push("/admin/dashboard")
        } else if (user.role === "student") {
          router.push("/student/dashboard")
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">College Library System</h1>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}
