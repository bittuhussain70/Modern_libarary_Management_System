"use client"

import { useState, useEffect } from "react"
import { Clock, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export function SessionStatus() {
  const { user } = useAuth()
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [isOnline, setIsOnline] = useState(true)
  const [sessionDuration, setSessionDuration] = useState(0)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Track user activity
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

  // Update session duration
  useEffect(() => {
    if (!user) return

    const loginTime = localStorage.getItem("library_login_time")
    const startTime = loginTime ? Number.parseInt(loginTime) : Date.now()

    const interval = setInterval(() => {
      setSessionDuration(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [user])

  // Store login time
  useEffect(() => {
    if (user && !localStorage.getItem("library_login_time")) {
      localStorage.setItem("library_login_time", Date.now().toString())
    }
  }, [user])

  if (!user) return null

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m ${seconds % 60}s`
  }

  const getInactivityTime = () => {
    const inactiveMs = Date.now() - lastActivity
    const inactiveMinutes = Math.floor(inactiveMs / (1000 * 60))
    return inactiveMinutes
  }

  const inactiveMinutes = getInactivityTime()

  return (
    <Card className="fixed bottom-4 right-4 w-64 shadow-lg border bg-background/95 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Session Status</span>
            <div className="flex items-center gap-1">
              {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
              <Badge variant={isOnline ? "outline" : "destructive"} className="text-xs">
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Session Time:</span>
            <span className="font-mono">{formatDuration(sessionDuration)}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Inactive:</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={`font-mono ${inactiveMinutes > 10 ? "text-amber-600" : ""}`}>{inactiveMinutes}m</span>
            </div>
          </div>

          {inactiveMinutes > 10 && (
            <div className="pt-1">
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                Session will expire in {15 - inactiveMinutes} minutes
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
