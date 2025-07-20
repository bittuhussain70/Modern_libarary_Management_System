"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resendVerificationEmail } from "../actions/email-verification"

export default function ResendVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage("")

    try {
      console.log(`🔄 Attempting to resend verification email to: ${email}`)

      // Use the updated resend function
      const result = await resendVerificationEmail(email)

      if (result.success) {
        setIsSuccess(true)
        setSuccessMessage(result.message)
        console.log(`✅ Verification email resent successfully to: ${email}`)
      } else {
        setError(result.message || "Failed to send verification email. Please try again.")
        console.error(`❌ Failed to resend verification email: ${result.message}`)
      }
    } catch (err) {
      console.error("❌ Error resending verification email:", err)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Resend Verification Email</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a new verification link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-lg">Verification Email Sent!</h3>
                <p className="text-muted-foreground mt-2">
                  We've sent a new verification link to <span className="font-medium">{email}</span>. Please check your
                  inbox and click the link to verify your email address.
                </p>
                {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Don't see the email? Check your spam folder or wait a few minutes for delivery.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Verification Email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Link
                  </>
                )}
              </Button>

              {/* Debug info for development */}
              <Alert className="bg-gray-50 border-gray-200">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-700 text-sm">
                  <strong>Development Mode:</strong> Email sending is simulated. Check the browser console for the
                  verification link.
                </AlertDescription>
              </Alert>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {isSuccess ? (
            <div className="flex flex-col gap-2 w-full">
              <Button className="w-full" onClick={() => router.push("/login")}>
                Continue to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail("")
                  setError(null)
                  setSuccessMessage("")
                }}
              >
                Send to Different Email
              </Button>
            </div>
          ) : (
            <Button variant="link" asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
