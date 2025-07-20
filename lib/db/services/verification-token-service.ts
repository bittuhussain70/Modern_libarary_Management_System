import { randomBytes } from "crypto"

// Mock database for development/preview
interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

// In-memory storage for development (replace with actual database in production)
const mockTokenStorage = new Map<string, VerificationToken>()

export class VerificationTokenService {
  /**
   * Create a new verification token
   */
  static async create(email: string, expiresInHours = 24): Promise<string> {
    try {
      // Generate a random token
      const token = randomBytes(32).toString("hex")

      // Set expiration
      const expires = new Date()
      expires.setHours(expires.getHours() + expiresInHours)

      // For development/preview, use in-memory storage
      // In production, this would use the actual database
      mockTokenStorage.set(token, {
        identifier: email,
        token,
        expires,
      })

      console.log(`Created verification token for ${email}, expires: ${expires.toISOString()}`)
      return token
    } catch (error) {
      console.error("Failed to create verification token:", error)
      throw new Error("Failed to create verification token")
    }
  }

  /**
   * Verify a token and return the associated email if valid
   */
  static async verify(token: string): Promise<string | null> {
    try {
      // For development/preview, use in-memory storage
      // In production, this would query the actual database
      const verificationToken = mockTokenStorage.get(token)

      // If token doesn't exist or is expired
      if (!verificationToken || verificationToken.expires < new Date()) {
        console.log(`Token verification failed: ${token}`)
        return null
      }

      // Delete the token to prevent reuse
      mockTokenStorage.delete(token)

      console.log(`Token verified successfully for: ${verificationToken.identifier}`)
      return verificationToken.identifier
    } catch (error) {
      console.error("Failed to verify token:", error)
      return null
    }
  }

  /**
   * Clean up expired tokens (for maintenance)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const now = new Date()
      let cleanedCount = 0

      // For development/preview, clean up in-memory storage
      for (const [token, data] of mockTokenStorage.entries()) {
        if (data.expires < now) {
          mockTokenStorage.delete(token)
          cleanedCount++
        }
      }

      console.log(`Cleaned up ${cleanedCount} expired tokens`)
      return cleanedCount
    } catch (error) {
      console.error("Failed to cleanup expired tokens:", error)
      return 0
    }
  }

  /**
   * Get token statistics (for admin dashboard)
   */
  static async getTokenStats(): Promise<{
    total: number
    expired: number
    active: number
  }> {
    try {
      const now = new Date()
      let total = 0
      let expired = 0
      let active = 0

      // For development/preview, count in-memory storage
      for (const [, data] of mockTokenStorage.entries()) {
        total++
        if (data.expires < now) {
          expired++
        } else {
          active++
        }
      }

      return { total, expired, active }
    } catch (error) {
      console.error("Failed to get token stats:", error)
      return { total: 0, expired: 0, active: 0 }
    }
  }
}
