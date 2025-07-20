"use client"

import { useState } from "react"
import {
  BookOpen,
  Users,
  UserCheck,
  AlertCircle,
  Plus,
  Bell,
  BarChart3,
  Library,
  UserPlus,
  BookPlus,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

// Mock data for admin dashboard
const dashboardStats = {
  totalBooks: 15420,
  totalStudents: 2847,
  activeLoans: 1234,
  overdueBooks: 89,
  newRegistrations: 23,
  todayVisitors: 156,
}

const recentActivities = [
  { id: 1, type: "loan", user: "Alice Johnson", book: "Introduction to Algorithms", time: "2 hours ago" },
  { id: 2, type: "return", user: "Bob Smith", book: "Database Systems", time: "3 hours ago" },
  { id: 3, type: "registration", user: "Carol Davis", book: "New Student Registration", time: "5 hours ago" },
  { id: 4, type: "overdue", user: "David Wilson", book: "Machine Learning Basics", time: "1 day ago" },
]

const overdueBooks = [
  { id: 1, student: "John Doe", book: "Advanced Mathematics", dueDate: "2024-01-15", daysOverdue: 5 },
  { id: 2, student: "Jane Smith", book: "Physics Fundamentals", dueDate: "2024-01-18", daysOverdue: 2 },
  { id: 3, student: "Mike Johnson", book: "Chemistry Lab Manual", dueDate: "2024-01-12", daysOverdue: 8 },
]

const popularBooks = [
  { id: 1, title: "Introduction to Programming", loans: 45, category: "Computer Science" },
  { id: 2, title: "Calculus and Analytical Geometry", loans: 38, category: "Mathematics" },
  { id: 3, title: "Organic Chemistry", loans: 32, category: "Chemistry" },
  { id: 4, title: "Modern Physics", loans: 28, category: "Physics" },
]

function AdminDashboardContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Library Administration</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalBooks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{dashboardStats.newRegistrations} new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.activeLoans.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">87% return rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardStats.overdueBooks}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used administrative functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex-col gap-2">
                  <BookPlus className="h-6 w-6" />
                  Add New Book
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <UserPlus className="h-6 w-6" />
                  Register Student
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Library className="h-6 w-6" />
                  Manage Loans
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <BarChart3 className="h-6 w-6" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest library transactions and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "loan"
                            ? "bg-blue-500"
                            : activity.type === "return"
                              ? "bg-green-500"
                              : activity.type === "registration"
                                ? "bg-purple-500"
                                : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-xs text-muted-foreground">{activity.book}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Books Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Overdue Books
                </CardTitle>
                <CardDescription>Books that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{book.student}</p>
                        <p className="text-sm text-muted-foreground">{book.book}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{book.daysOverdue} days</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Due: {book.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  Send Reminder Emails
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Popular Books */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Books This Month</CardTitle>
              <CardDescription>Most borrowed books and their categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Loans</TableHead>
                    <TableHead>Popularity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>{book.loans}</TableCell>
                      <TableCell>
                        <Progress value={(book.loans / 50) * 100} className="w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>System Maintenance:</strong> Scheduled maintenance on Sunday, 2:00 AM - 4:00 AM
              </AlertDescription>
            </Alert>

            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>New Feature:</strong> Digital book lending system is now available for testing
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin", "librarian"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
