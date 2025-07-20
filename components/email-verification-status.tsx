import { CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmailVerificationStatusProps {
  isVerified: boolean
  email?: string
  showResendButton?: boolean
  showAlert?: boolean
}

export function EmailVerificationStatus({
  isVerified,
  email,
  showResendButton = false,
  showAlert = true,
}: EmailVerificationStatusProps) {
  return (
    <div className="space-y-3">
      {isVerified ? (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Email Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Email Not Verified
        </Badge>
      )}

      {showAlert && !isVerified && (
        <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            Please verify your email address to access all features.
            {email && ` We sent a verification link to ${email}.`}
          </AlertDescription>
        </Alert>
      )}

      {showResendButton && !isVerified && (
        <Button variant="outline" size="sm" asChild>
          <Link href="/resend-verification">Resend Verification Email</Link>
        </Button>
      )}
    </div>
  )
}
