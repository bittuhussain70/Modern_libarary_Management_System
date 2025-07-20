"use client"

import { useState } from "react"
import { BookOpen, Clock, Star, Search, Heart, Eye, Filter, TrendingUp, Award, Target, BookMarked } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { StudentSidebar } from "@/components/student-sidebar"
import { useAuth } from "@/components/auth-provider"

// Mock data for student dashboard
const studentStats = {
  booksLoaned: 5,
  booksRead: 23,
  favoriteBooks: 12,
  readingGoal: 50,
  currentStreak: 7,
}

const currentLoans = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    dueDate: "2024-02-15",
    daysLeft: 5,
    renewals: 1,
    maxRenewals: 2,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    dueDate: "2024-02-20",
    daysLeft: 10,
    renewals: 0,
    maxRenewals: 2,
  },
  {
    id: 3,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    dueDate: "2024-02-12",
    daysLeft: 2,
    renewals: 2,
    maxRenewals: 2,
  },
]

const recommendedBooks = [
  { id: 1, title: "Design Patterns", author: "Gang of Four", rating: 4.8, available: true },
  { id: 2, title: "System Design Interview", author: "Alex Xu", rating: 4.7, available: true },
  { id: 3, title: "Cracking the Coding Interview", author: "Gayle McDowell", rating: 4.6, available: false },
  { id: 4, title: "The Pragmatic Programmer", author: "Andy Hunt", rating: 4.9, available: true },
]

const recentActivity = [
  { id: 1, action: "Borrowed", book: "Introduction to Algorithms", date: "2024-01-20" },
  { id: 2, action: "Returned", book: "Data Structures", date: "2024-01-18" },
  { id: 3, action: "Reserved", book: "Machine Learning", date: "2024-01-15" },
  { id: 4, action: "Reviewed", book: "Clean Architecture", date: "2024-01-12" },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || user.role !== "student") {
    return <div>Access denied. Student role required.</div>
  }

  const readingProgress = (studentStats.booksRead / studentStats.readingGoal) * 100

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Library</h1>
              <p className="text-muted-foreground">Welcome back, {user.name || user.email.split("@")[0]}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Student Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Books Loaned</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.booksLoaned}</div>
                <p className="text-xs text-muted-foreground">Currently borrowed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.booksRead}</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.favoriteBooks}</div>
                <p className="text-xs text-muted-foreground">Saved books</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reading Goal</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(readingProgress)}%</div>
                <Progress value={readingProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentStats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">Days in a row</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Loans */}
            <Card>
              <CardHeader>
                <CardTitle>My Current Books</CardTitle>
                <CardDescription>Books you have borrowed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{loan.title}</h4>
                        <p className="text-sm text-muted-foreground">{loan.author}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">Due: {loan.dueDate}</span>
                          <Badge variant={loan.daysLeft <= 3 ? "destructive" : "outline"}>
                            {loan.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" disabled={loan.renewals >= loan.maxRenewals}>
                          {loan.renewals >= loan.maxRenewals ? "Max Renewals" : "Renew"}
                        </Button>
                        <span className="text-xs text-center text-muted-foreground">
                          {loan.renewals}/{loan.maxRenewals} renewals
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Books */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your reading history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{book.rating}</span>
                          </div>
                          <Badge variant={book.available ? "outline" : "secondary"}>
                            {book.available ? "Available" : "Reserved"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" disabled={!book.available}>
                          {book.available ? "Reserve" : "Waitlist"}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your library activity history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge variant="outline">{activity.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{activity.book}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reading Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Progress</CardTitle>
              <CardDescription>Track your reading goals and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Annual Reading Goal</span>
                    <span className="text-sm text-muted-foreground">
                      {studentStats.booksRead} / {studentStats.readingGoal} books
                    </span>
                  </div>
                  <Progress value={readingProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Books This Year</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-muted-foreground">Hours Read</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">7</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
