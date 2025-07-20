"use client"

import { useState } from "react"
import { Search, Filter, Eye, Check, X, Download, Upload, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/components/auth-provider"

// Mock registration data
const registrations = [
  {
    id: 1,
    studentId: "CS2024001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@student.college.edu",
    phone: "+1-555-0123",
    department: "Computer Science",
    program: "B.Tech CS",
    submittedDate: "2024-01-30",
    status: "pending",
    emailVerified: true,
    documents: {
      photo: true,
      id_proof: true,
      academic: true,
      address: false,
      medical: false,
    },
    verificationNotes: "",
  },
  {
    id: 2,
    studentId: "EE2024001",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@student.college.edu",
    phone: "+1-555-0124",
    department: "Electrical Engineering",
    program: "B.Tech EE",
    submittedDate: "2024-01-29",
    status: "approved",
    emailVerified: true,
    documents: {
      photo: true,
      id_proof: true,
      academic: true,
      address: true,
      medical: true,
    },
    verificationNotes: "All documents verified successfully",
  },
  {
    id: 3,
    studentId: "ME2024001",
    firstName: "Carol",
    lastName: "Davis",
    email: "carol.davis@student.college.edu",
    phone: "+1-555-0125",
    department: "Mechanical Engineering",
    program: "M.Tech ME",
    submittedDate: "2024-01-28",
    status: "rejected",
    emailVerified: false,
    documents: {
      photo: true,
      id_proof: false,
      academic: true,
      address: true,
      medical: false,
    },
    verificationNotes: "Invalid ID proof document. Please resubmit.",
  },
]

export default function RegistrationManagement() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<"all" | "verified" | "unverified">("all")

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || reg.department === departmentFilter
    const matchesEmailVerified =
      emailVerifiedFilter === "all" ||
      (emailVerifiedFilter === "verified" && reg.emailVerified) ||
      (emailVerifiedFilter === "unverified" && !reg.emailVerified)

    return matchesSearch && matchesStatus && matchesDepartment && matchesEmailVerified
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleApprove = (registrationId: number) => {
    console.log("Approving registration:", registrationId)
    // Update registration status
  }

  const handleReject = (registrationId: number) => {
    console.log("Rejecting registration:", registrationId)
    // Update registration status
  }

  const getDocumentStatus = (documents: any) => {
    const total = Object.keys(documents).length
    const completed = Object.values(documents).filter(Boolean).length
    return `${completed}/${total}`
  }

  if (!user || (user.role !== "admin" && user.role !== "librarian")) {
    return <div>Access denied. Admin or Librarian role required.</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Registrations</h1>
              <p className="text-muted-foreground">Manage and verify new student registrations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.filter((r) => r.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.filter((r) => r.status === "approved").length}</div>
                <p className="text-xs text-muted-foreground">Successfully verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <X className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.filter((r) => r.status === "rejected").length}</div>
                <p className="text-xs text-muted-foreground">Need resubmission</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={emailVerifiedFilter} onValueChange={(value) => setEmailVerifiedFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Email Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Email Status</SelectItem>
                      <SelectItem value="verified">Email Verified</SelectItem>
                      <SelectItem value="unverified">Email Unverified</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registrations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Applications</CardTitle>
              <CardDescription>Review and manage student registration applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {registration.firstName.charAt(0)}
                              {registration.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {registration.firstName} {registration.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{registration.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{registration.studentId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{registration.department}</p>
                          <p className="text-sm text-muted-foreground">{registration.program}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getDocumentStatus(registration.documents)} Complete</Badge>
                      </TableCell>
                      <TableCell>{registration.submittedDate}</TableCell>
                      <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      <TableCell>
                        {registration.emailVerified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedRegistration(registration)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Registration Details</DialogTitle>
                                <DialogDescription>
                                  Review student registration information and documents
                                </DialogDescription>
                              </DialogHeader>

                              {selectedRegistration && (
                                <Tabs defaultValue="personal" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="academic">Academic</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="verification">Verification</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <p>
                                          {selectedRegistration.firstName} {selectedRegistration.lastName}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p>{selectedRegistration.email}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p>{selectedRegistration.phone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Student ID</label>
                                        <p>{selectedRegistration.studentId}</p>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="academic" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Department</label>
                                        <p>{selectedRegistration.department}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Program</label>
                                        <p>{selectedRegistration.program}</p>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="documents" className="space-y-4">
                                    <div className="space-y-3">
                                      {Object.entries(selectedRegistration.documents).map(([doc, status]) => (
                                        <div key={doc} className="flex items-center justify-between p-3 border rounded">
                                          <span className="capitalize">{doc.replace("_", " ")}</span>
                                          {status ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                              <Check className="w-3 h-3 mr-1" />
                                              Uploaded
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-red-600 border-red-600">
                                              <X className="w-3 h-3 mr-1" />
                                              Missing
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="verification" className="space-y-4">
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Current Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium">Verification Notes</label>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {selectedRegistration.verificationNotes || "No notes available"}
                                        </p>
                                      </div>

                                      {selectedRegistration.status === "pending" && (
                                        <div className="flex gap-2 pt-4">
                                          <Button
                                            onClick={() => handleApprove(selectedRegistration.id)}
                                            className="flex-1"
                                          >
                                            <Check className="w-4 h-4 mr-2" />
                                            Approve Registration
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() => handleReject(selectedRegistration.id)}
                                            className="flex-1"
                                          >
                                            <X className="w-4 h-4 mr-2" />
                                            Reject Registration
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>

                          {registration.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(registration.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(registration.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
