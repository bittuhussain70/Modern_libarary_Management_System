"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "librarian" | "student")[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedRoles = ["admin", "librarian", "student"],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo)
      } else if (!allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === "student") {
          router.push("/student/dashboard")
        } else {
          router.push("/admin/dashboard")
        }
      }
    }
  }, [user, isLoading, router, allowedRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
