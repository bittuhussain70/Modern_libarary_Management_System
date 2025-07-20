import { sendVerificationEmail } from "@/lib/email"

/**
 * Test email configuration and send a test email
 */
export async function testEmailConfiguration(testEmail: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Test sending a verification email
    const success = await sendVerificationEmail(testEmail, "Test User", "test-token-123")

    if (success) {
      return {
        success: true,
        message: "Test email sent successfully! Check your inbox.",
      }
    } else {
      return {
        success: false,
        message: "Failed to send test email. Please check your SMTP configuration.",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Email test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): {
  isValid: boolean
  missingVars: string[]
} {
  const requiredVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "FROM_EMAIL"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}
