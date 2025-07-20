"use client"

import { useSearchParams } from "next/navigation"
import { Mail, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function PendingVerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const studentId = searchParams.get("studentId")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-lg text-gray-600">One more step to complete your registration</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Email Verification Required</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please check your inbox and verify your email to
              activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                  <span className="font-medium">{email}</span>
                </div>

                {studentId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Student ID</span>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {studentId}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Account Status</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending Verification
                  </Badge>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You won't be able to access your account until you verify your email address.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" asChild>
              <Link href="/resend-verification">
                Didn't receive an email? Resend
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Verify Your Email</h3>
                  <p className="text-sm text-gray-600">Click the verification link in the email we sent to {email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Account Activation</h3>
                  <p className="text-sm text-gray-600">Once verified, your account will be activated automatically</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Start Using the System</h3>
                  <p className="text-sm text-gray-600">Log in with your email and password to access all features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
