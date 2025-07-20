"use client"

import { useState } from "react"
import { Mail, Phone, Calendar, Edit, Save, X, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StudentSidebar } from "@/components/student-sidebar"
import { useAuth } from "@/components/auth-provider"

export default function StudentProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 College Street, University City, State 12345",
    bio: "Computer Science student passionate about algorithms and software development.",
    interests: ["Programming", "Mathematics", "Machine Learning", "Web Development"],
    academicInfo: {
      studentId: "CS2024001",
      department: "Computer Science",
      program: "B.Tech CS",
      year: "3rd Year",
      gpa: "3.8",
    },
  })

  if (!user || user.role !== "student") {
    return <div>Access denied. Student role required.</div>
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName.charAt(0)}
                      {profileData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-muted-foreground">{profileData.academicInfo.studentId}</p>
                  <Badge variant="secondary" className="mt-2">
                    {profileData.academicInfo.program}
                  </Badge>
                </div>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.academicInfo.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? "Update your personal details" : "Your personal information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={true} // Email usually can't be changed
                    />
                    <p className="text-xs text-muted-foreground">Contact admin to change your email address</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic details (read-only)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <Input value={profileData.academicInfo.studentId} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={profileData.academicInfo.department} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Program</Label>
                      <Input value={profileData.academicInfo.program} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Year</Label>
                      <Input value={profileData.academicInfo.year} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA</Label>
                      <Input value={profileData.academicInfo.gpa} disabled />
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <AlertDescription>
                      Academic information is managed by the administration. Contact your academic advisor for any
                      changes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                  <CardDescription>
                    {isEditing ? "Update your interests to get better book recommendations" : "Your reading interests"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                        {isEditing && (
                          <button
                            className="ml-2 hover:text-destructive"
                            onClick={() => {
                              setProfileData((prev) => ({
                                ...prev,
                                interests: prev.interests.filter((_, i) => i !== index),
                              }))
                            }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <Input
                        placeholder="Add new interest and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            setProfileData((prev) => ({
                              ...prev,
                              interests: [...prev.interests, e.currentTarget.value.trim()],
                            }))
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
