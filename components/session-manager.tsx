"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useInactivityTimer } from "@/hooks/use-inactivity-timer"
import { SessionTimeoutWarning } from "@/components/session-timeout-warning"
import { useAuth } from "@/components/auth-provider"

interface SessionManagerProps {
  children: React.ReactNode
}

// Configuration constants
const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes in milliseconds
const WARNING_DURATION = 60 // 60 seconds warning
const WARNING_THRESHOLD = 2 * 60 * 1000 // Show warning 2 minutes before timeout

export function SessionManager({ children }: SessionManagerProps) {
  const { user, logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Handle session timeout
  const handleTimeout = useCallback(() => {
    console.log("Session timed out due to inactivity")
    logout()
  }, [logout])

  // Handle warning timeout (when warning dialog times out)
  const handleWarningTimeout = useCallback(() => {
    console.log("Session warning timed out, logging out")
    setShowWarning(false)
    logout()
  }, [logout])

  // Extend session when user chooses to stay logged in
  const handleExtendSession = useCallback(() => {
    console.log("Session extended by user")
    setShowWarning(false)
    setLastActivity(Date.now())
    resetTimer()
  }, [])

  // Show warning before timeout
  const handleShowWarning = useCallback(() => {
    console.log("Showing session timeout warning")
    setShowWarning(true)
  }, [])

  // Main inactivity timer
  const { resetTimer } = useInactivityTimer({
    timeout: INACTIVITY_TIMEOUT - WARNING_THRESHOLD,
    onTimeout: handleShowWarning,
    enabled: !!user,
  })

  // Update last activity timestamp
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click", "keydown"]

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [])

  // Don't render session manager for non-authenticated users
  if (!user) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <SessionTimeoutWarning
        isOpen={showWarning}
        onExtendSession={handleExtendSession}
        onLogout={handleWarningTimeout}
        warningDuration={WARNING_DURATION}
      />
    </>
  )
}
