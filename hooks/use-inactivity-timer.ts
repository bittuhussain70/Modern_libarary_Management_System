"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseInactivityTimerProps {
  timeout: number // timeout in milliseconds
  onTimeout: () => void
  enabled?: boolean
}

export function useInactivityTimer({ timeout, onTimeout, enabled = true }: UseInactivityTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onTimeoutRef = useRef(onTimeout)

  // Update the timeout callback ref when it changes
  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  const resetTimer = useCallback(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onTimeoutRef.current()
    }, timeout)
  }, [timeout, enabled])

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      return
    }

    // Events that indicate user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click", "keydown"]

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer()
    }

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Start the initial timer
    resetTimer()

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearTimer()
    }
  }, [resetTimer, clearTimer, enabled])

  return { resetTimer, clearTimer }
}
