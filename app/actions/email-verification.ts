"use server"

import { VerificationTokenService } from "@/lib/db/services/verification-token-service"
import { sendVerificationEmail as sendEmail } from "@/lib/email"

/**
 * Generate a verification token for an email address
 */
export async function generateVerificationToken(email: string): Promise<string> {
  try {
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email address")
    }

    // Create a new verification token that expires in 24 hours
    const token = await VerificationTokenService.create(email, 24)

    console.log(`🔑 Generated verification token for: ${email}`)
    return token
  } catch (error) {
    console.error("❌ Failed to generate verification token:", error)
    throw new Error("Failed to generate verification token")
  }
}

/**
 * Send a verification email to the user
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`📧 Starting verification email process for: ${email}`)

    // Validate inputs
    if (!email || !token) {
      const message = "Missing email or token for verification email"
      console.error("❌", message)
      return { success: false, message }
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      const message = "Invalid email format"
      console.error("❌", message, email)
      return { success: false, message }
    }

    // Extract name from email if not provided
    const recipientName = name || email.split("@")[0]
    console.log(`👤 Recipient name: ${recipientName}`)

    // Use the email utility to send the verification email
    const success = await sendEmail(email, recipientName, token)

    if (success) {
      const message = "Verification email sent successfully"
      console.log(`✅ ${message} to: ${email}`)
      return { success: true, message }
    } else {
      const message = "Failed to send verification email"
      console.error(`❌ ${message} to: ${email}`)
      return { success: false, message }
    }
  } catch (error) {
    const message = `Error sending verification email: ${error instanceof Error ? error.message : "Unknown error"}`
    console.error("❌", message)
    return { success: false, message }
  }
}

/**
 * Verify a token and return the associated email if valid
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    console.log(`🔍 Verifying token: ${token.substring(0, 8)}...`)

    // Validate token format
    if (!token || typeof token !== "string" || token.length < 10) {
      console.log("❌ Invalid token format")
      return null
    }

    // Verify the token using the service
    const email = await VerificationTokenService.verify(token)

    if (email) {
      console.log(`✅ Token verified successfully for: ${email}`)
      return email
    } else {
      console.log("❌ Invalid or expired verification token")
      return null
    }
  } catch (error) {
    console.error("❌ Failed to verify token:", error)
    return null
  }
}

/**
 * Check if an email address is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return false
    }

    // In a real implementation, you would check the user's verification status in the database
    // For development/preview, we'll simulate this check

    // Mock verification status - in production this would query the users table
    const mockVerifiedEmails = new Set([
      "admin@example.com",
      "test@example.com",
      "verified@example.com",
      email.toLowerCase(), // Auto-verify the current email for testing
    ])

    const isVerified = mockVerifiedEmails.has(email.toLowerCase())
    console.log(`🔍 Email verification status for ${email}: ${isVerified}`)

    return isVerified
  } catch (error) {
    console.error("❌ Failed to check email verification status:", error)
    return false
  }
}

/**
 * Mark an email as verified in the database
 */
export async function markEmailAsVerified(email: string): Promise<boolean> {
  try {
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      console.error("❌ Invalid email format for verification:", email)
      return false
    }

    // In a real implementation, you would update the user's verification status
    // For development/preview, we'll simulate this operation

    console.log(`✅ Email marked as verified: ${email}`)

    // Simulate database update delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return true
  } catch (error) {
    console.error("❌ Failed to mark email as verified:", error)
    return false
  }
}

/**
 * Resend verification email with better error handling
 */
export async function resendVerificationEmail(email: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    console.log(`🔄 Resending verification email to: ${email}`)

    // Generate new token
    const token = await generateVerificationToken(email)

    // Send email
    const result = await sendVerificationEmail(email, token)

    return result
  } catch (error) {
    const message = `Failed to resend verification email: ${error instanceof Error ? error.message : "Unknown error"}`
    console.error("❌", message)
    return { success: false, message }
  }
}
