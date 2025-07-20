"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyToken, markEmailAsVerified } from "../actions/email-verification"

enum VerificationStatus {
  VERIFYING = "verifying",
  SUCCESS = "success",
  EXPIRED = "expired",
  INVALID = "invalid",
  ERROR = "error",
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.VERIFYING)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get("token")

      if (!token) {
        setStatus(VerificationStatus.INVALID)
        setError("No verification token provided")
        return
      }

      try {
        console.log("Verifying token:", token)

        // Verify the token
        const verifiedEmail = await verifyToken(token)

        if (verifiedEmail) {
          setEmail(verifiedEmail)
          console.log("Token verified for email:", verifiedEmail)

          // Mark the email as verified in the database
          const marked = await markEmailAsVerified(verifiedEmail)

          if (marked) {
            setStatus(VerificationStatus.SUCCESS)
            console.log("Email marked as verified successfully")
          } else {
            setStatus(VerificationStatus.ERROR)
            setError("Failed to update verification status")
          }
        } else {
          setStatus(VerificationStatus.EXPIRED)
          setError("Token is invalid or has expired")
        }
      } catch (error) {
        console.error("Error verifying email:", error)
        setStatus(VerificationStatus.ERROR)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      }
    }

    verifyEmailToken()
  }, [searchParams])

  const getStatusContent = () => {
    switch (status) {
      case VerificationStatus.VERIFYING:
        return {
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
          title: "Verifying Your Email",
          description: "Please wait while we verify your email address...",
          showActions: false,
        }

      case VerificationStatus.SUCCESS:
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: "Email Verified Successfully!",
          description: `Your email address has been verified successfully. You can now access all features of your account.`,
          showActions: true,
          primaryAction: {
            text: "Continue to Login",
            href: "/login",
            variant: "default" as const,
          },
        }

      case VerificationStatus.EXPIRED:
        return {
          icon: <XCircle className="h-16 w-16 text-amber-500" />,
          title: "Verification Link Expired",
          description: "The verification link has expired. Please request a new verification email to continue.",
          showActions: true,
          primaryAction: {
            text: "Request New Link",
            href: "/resend-verification",
            variant: "default" as const,
          },
        }

      case VerificationStatus.INVALID:
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Invalid Verification Link",
          description: "The verification link is invalid or malformed. Please check the link and try again.",
          showActions: true,
          primaryAction: {
            text: "Request New Link",
            href: "/resend-verification",
            variant: "default" as const,
          },
        }

      case VerificationStatus.ERROR:
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Verification Failed",
          description: "An error occurred while verifying your email. Please try again or contact support.",
          showActions: true,
          primaryAction: {
            text: "Try Again",
            href: "/resend-verification",
            variant: "default" as const,
          },
        }
    }
  }

  const content = getStatusContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">{content.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="flex flex-col items-center gap-4">
            {content.icon}
            <div className="text-center">
              <h3 className="font-medium text-lg">{content.title}</h3>

              {email && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{email}</span>
                  </div>
                </div>
              )}

              {status === VerificationStatus.SUCCESS && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Welcome! Your account is now fully activated and ready to use.
                  </AlertDescription>
                </Alert>
              )}

              {error && status !== VerificationStatus.SUCCESS && (
                <Alert className="mt-4 bg-red-50 border-red-200">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>

        {content.showActions && (
          <CardFooter className="flex flex-col gap-2">
            {content.primaryAction && (
              <Button className="w-full" asChild>
                <Link href={content.primaryAction.href}>
                  {content.primaryAction.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
