"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SessionTimeoutWarningProps {
  isOpen: boolean
  onExtendSession: () => void
  onLogout: () => void
  warningDuration: number // in seconds
}

export function SessionTimeoutWarning({
  isOpen,
  onExtendSession,
  onLogout,
  warningDuration,
}: SessionTimeoutWarningProps) {
  const [timeLeft, setTimeLeft] = useState(warningDuration)

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(warningDuration)
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, warningDuration, onLogout])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressValue = ((warningDuration - timeLeft) / warningDuration) * 100

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>Your session will expire due to inactivity</DialogDescription>
        </DialogHeader>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Time Remaining
            </CardTitle>
            <CardDescription className="text-amber-700">You will be automatically logged out in:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{formatTime(timeLeft)}</div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <div className="flex gap-3">
              <Button onClick={onExtendSession} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Stay Logged In
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex-1 bg-transparent">
                Logout Now
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Click anywhere or press any key to extend your session automatically
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
