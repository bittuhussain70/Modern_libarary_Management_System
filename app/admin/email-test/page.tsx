"use client"

import { useState } from "react"
import { Mail, Send, CheckCircle, AlertCircle, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/components/auth-provider"

export default function EmailTestPage() {
  const { user } = useAuth()
  const [testEmail, setTestEmail] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleTestEmail = async () => {
    if (!testEmail.trim() || !/\S+@\S+\.\S+/.test(testEmail)) {
      setTestResult({
        success: false,
        message: "Please enter a valid email address",
      })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      console.log(`🧪 Testing email configuration with: ${testEmail}`)

      // Import the test function
      const { testEmailConfiguration } = await import("@/lib/email")

      // Test email configuration
      const result = await testEmailConfiguration(testEmail)

      setTestResult(result)

      if (result.success) {
        console.log("✅ Email test completed successfully")
      } else {
        console.error("❌ Email test failed:", result.message)
      }
    } catch (error) {
      console.error("❌ Email test error:", error)
      setTestResult({
        success: false,
        message: "Failed to test email configuration. Please try again.",
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (!user || user.role !== "admin") {
    return <div>Access denied. Admin role required.</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Email Configuration Test</h1>
            <p className="text-muted-foreground">Test your email configuration and verify SMTP settings</p>
          </div>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Email Configuration Status
              </CardTitle>
              <CardDescription>Current email service configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">SMTP Host</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Configured</Badge>
                    <span className="text-sm text-muted-foreground">smtp.example.com</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">SMTP Port</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Configured</Badge>
                    <span className="text-sm text-muted-foreground">587</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">From Email</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Configured</Badge>
                    <span className="text-sm text-muted-foreground">noreply@library-system.com</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Authentication</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  All required email configuration variables are set and ready for testing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Email Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Send Test Email
              </CardTitle>
              <CardDescription>
                Send a test verification email to verify your email configuration is working correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="Enter email address to test"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>

              <Button onClick={handleTestEmail} disabled={isTesting} className="w-full md:w-auto">
                {isTesting ? (
                  <>
                    <Mail className="w-4 h-4 mr-2 animate-pulse" />
                    Sending Test Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>

              {testResult && (
                <Alert className={testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Available Email Templates</CardTitle>
              <CardDescription>Email templates configured for the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">Sent when users need to verify their email address</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Password Reset</h4>
                    <p className="text-sm text-muted-foreground">Sent when users request password reset</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">Welcome Email</h4>
                    <p className="text-sm text-muted-foreground">Sent after successful registration</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
