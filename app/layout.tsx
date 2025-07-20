import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { SessionManager } from "@/components/session-manager"
import { SessionStatus } from "@/components/session-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "College Library Management System",
  description: "A comprehensive library management system for educational institutions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SessionManager>
            {children}
            <SessionStatus />
          </SessionManager>
        </AuthProvider>
      </body>
    </html>
  )
}
