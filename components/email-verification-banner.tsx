"use client"

import { useState } from "react"
import { AlertTriangle, Mail, X, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { generateVerificationToken, sendVerificationEmail } from "@/app/actions/email-verification"

interface EmailVerificationBannerProps {
  email: string
  isVerified: boolean
  onDismiss?: () => void
  showDismiss?: boolean
}

export function EmailVerificationBanner({
  email,
  isVerified,
  onDismiss,
  showDismiss = true,
}: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  if (isVerified) {
    return null
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendError(null)

    try {
      const token = await generateVerificationToken(email)
      const success = await sendVerificationEmail(email, token)

      if (success) {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 5000) // Hide success message after 5 seconds
      } else {
        setResendError("Failed to send verification email. Please try again.")
      }
    } catch (error) {
      setResendError("An error occurred. Please try again later.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200 mb-6">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">Email verification required</p>
            <p className="text-sm mt-1">
              Please verify your email address ({email}) to access all features.
              {resendSuccess && <span className="text-green-600 font-medium ml-2">✓ Verification email sent!</span>}
              {resendError && <span className="text-red-600 font-medium ml-2">{resendError}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResending}
              className="bg-white hover:bg-yellow-50"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3 mr-1" />
                  Resend
                </>
              )}
            </Button>

            {showDismiss && onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0 hover:bg-yellow-100">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
