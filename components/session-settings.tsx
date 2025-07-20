"use client"

import { useState } from "react"
import { Clock, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SessionSettingsProps {
  onSave?: (settings: SessionSettings) => void
}

interface SessionSettings {
  inactivityTimeout: number // in minutes
  warningDuration: number // in seconds
  maxSessionDuration: number // in hours
  enableWarning: boolean
  enableAutoLogout: boolean
}

const defaultSettings: SessionSettings = {
  inactivityTimeout: 15, // 15 minutes
  warningDuration: 60, // 60 seconds
  maxSessionDuration: 8, // 8 hours
  enableWarning: true,
  enableAutoLogout: true,
}

export function SessionSettings({ onSave }: SessionSettingsProps) {
  const [settings, setSettings] = useState<SessionSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save to localStorage for demo
    localStorage.setItem("library_session_settings", JSON.stringify(settings))

    onSave?.(settings)
    setIsSaving(false)
    setSaved(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setSaved(false)
  }

  const updateSetting = <K extends keyof SessionSettings>(key: K, value: SessionSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Session Management Settings
        </CardTitle>
        <CardDescription>Configure automatic logout and session timeout settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {saved && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Session settings have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Enable/Disable Features */}
        <div className="space-y-4">
          <h4 className="font-medium">Feature Controls</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Session Warnings</Label>
              <p className="text-sm text-muted-foreground">Show warning dialog before automatic logout</p>
            </div>
            <Switch
              checked={settings.enableWarning}
              onCheckedChange={(checked) => updateSetting("enableWarning", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Logout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out users after inactivity</p>
            </div>
            <Switch
              checked={settings.enableAutoLogout}
              onCheckedChange={(checked) => updateSetting("enableAutoLogout", checked)}
            />
          </div>
        </div>

        {/* Timeout Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Timeout Configuration</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inactivityTimeout">Inactivity Timeout</Label>
              <Select
                value={settings.inactivityTimeout.toString()}
                onValueChange={(value) => updateSetting("inactivityTimeout", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Time before showing logout warning</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warningDuration">Warning Duration</Label>
              <Select
                value={settings.warningDuration.toString()}
                onValueChange={(value) => updateSetting("warningDuration", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How long to show the warning dialog</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSessionDuration">Maximum Session Duration</Label>
              <Select
                value={settings.maxSessionDuration.toString()}
                onValueChange={(value) => updateSetting("maxSessionDuration", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Maximum time before forced logout</p>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Current Configuration</h4>
          <div className="text-sm space-y-1">
            <p>
              • Users will be warned after <strong>{settings.inactivityTimeout} minutes</strong> of inactivity
            </p>
            <p>
              • Warning dialog will show for <strong>{settings.warningDuration} seconds</strong>
            </p>
            <p>
              • Maximum session duration: <strong>{settings.maxSessionDuration} hours</strong>
            </p>
            <p>
              • Session warnings: <strong>{settings.enableWarning ? "Enabled" : "Disabled"}</strong>
            </p>
            <p>
              • Auto logout: <strong>{settings.enableAutoLogout ? "Enabled" : "Disabled"}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>

          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
