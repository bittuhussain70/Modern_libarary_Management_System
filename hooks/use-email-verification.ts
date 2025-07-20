"use client"

import { useState, useEffect } from "react"
import { isEmailVerified } from "@/app/actions/email-verification"

interface UseEmailVerificationProps {
  email: string
  initialVerified?: boolean
}

export function useEmailVerification({ email, initialVerified = false }: UseEmailVerificationProps) {
  const [isVerified, setIsVerified] = useState(initialVerified)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkVerificationStatus = async () => {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const verified = await isEmailVerified(email)
      setIsVerified(verified)
    } catch (err) {
      setError("Failed to check verification status")
      console.error("Error checking email verification:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkVerificationStatus()
  }, [email])

  const refreshStatus = () => {
    checkVerificationStatus()
  }

  return {
    isVerified,
    isLoading,
    error,
    refreshStatus,
  }
}
