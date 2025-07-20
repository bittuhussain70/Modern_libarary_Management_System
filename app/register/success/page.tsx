"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle, Download, Mail, User, Calendar, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegistrationSuccess() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get("studentId")
  const verified = searchParams.get("verified") === "true"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-lg text-gray-600">Welcome to our academic community</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Student Information
            </CardTitle>
            <CardDescription>Your registration has been submitted successfully. Here are your details:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Student ID</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {studentId}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Status</label>
                {verified ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending Email Verification
                  </Badge>
                )}
              </div>
            </div>

            {verified ? (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Your email has been verified and your account is now active. You can now log in to access all
                  features.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  A verification email has been sent to your registered email address. Please verify your email to
                  activate your account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Document Verification</h4>
                  <p className="text-sm text-gray-600">
                    Our admin team will verify your uploaded documents within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Account Activation</h4>
                  <p className="text-sm text-gray-600">
                    Once verified, you'll receive an email with your account activation link.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Library Access</h4>
                  <p className="text-sm text-gray-600">
                    Start exploring our digital library and book collection immediately after activation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Registration Confirmation
            </Button>

            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/library">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Library Catalog
              </Link>
            </Button>

            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@college.edu" className="text-blue-600 hover:underline">
              support@college.edu
            </a>
          </p>

          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
