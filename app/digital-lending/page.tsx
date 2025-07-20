"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Download, Clock, Star, Eye, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DigitalBookReader } from "@/components/digital-book-reader"
import Link from "next/link"

interface DigitalBook {
  id: string
  title: string
  author: string
  category: string
  format: "PDF" | "EPUB" | "MOBI"
  fileSize: string
  pages: number
  rating: number
  downloads: number
  readingTime: string
  coverUrl: string
  description: string
  isbn: string
  publishedYear: number
  language: string
  isAvailable: boolean
  isBorrowed?: boolean
  dueDate?: string
}

const mockDigitalBooks: DigitalBook[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    author: "Dr. Sarah Johnson",
    category: "Technology",
    format: "PDF",
    fileSize: "15.2 MB",
    pages: 450,
    rating: 4.8,
    downloads: 2340,
    readingTime: "8 hours",
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "A comprehensive guide to machine learning fundamentals and applications.",
    isbn: "978-0123456789",
    publishedYear: 2023,
    language: "English",
    isAvailable: true,
  },
  {
    id: "2",
    title: "Digital Marketing Strategies",
    author: "Mark Thompson",
    category: "Business",
    format: "EPUB",
    fileSize: "8.7 MB",
    pages: 320,
    rating: 4.6,
    downloads: 1890,
    readingTime: "6 hours",
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "Modern approaches to digital marketing in the social media age.",
    isbn: "978-0987654321",
    publishedYear: 2023,
    language: "English",
    isAvailable: true,
  },
  {
    id: "3",
    title: "Advanced Physics Concepts",
    author: "Prof. Michael Chen",
    category: "Science",
    format: "PDF",
    fileSize: "22.1 MB",
    pages: 680,
    rating: 4.9,
    downloads: 3120,
    readingTime: "12 hours",
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "Advanced concepts in quantum physics and relativity theory.",
    isbn: "978-0456789123",
    publishedYear: 2022,
    language: "English",
    isAvailable: false,
  },
  {
    id: "4",
    title: "Creative Writing Workshop",
    author: "Emma Rodriguez",
    category: "Literature",
    format: "EPUB",
    fileSize: "5.3 MB",
    pages: 280,
    rating: 4.7,
    downloads: 1560,
    readingTime: "5 hours",
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "Techniques and exercises for developing creative writing skills.",
    isbn: "978-0789123456",
    publishedYear: 2023,
    language: "English",
    isAvailable: true,
    isBorrowed: true,
    dueDate: "2024-02-15",
  },
]

export default function DigitalLendingPage() {
  const [books, setBooks] = useState<DigitalBook[]>(mockDigitalBooks)
  const [filteredBooks, setFilteredBooks] = useState<DigitalBook[]>(mockDigitalBooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [activeTab, setActiveTab] = useState("browse")
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null)
  const [isReaderOpen, setIsReaderOpen] = useState(false)

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
      const matchesFormat = selectedFormat === "all" || book.format === selectedFormat

      return matchesSearch && matchesCategory && matchesFormat
    })

    if (activeTab === "borrowed") {
      filtered = filtered.filter((book) => book.isBorrowed)
    } else if (activeTab === "available") {
      filtered = filtered.filter((book) => book.isAvailable && !book.isBorrowed)
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedCategory, selectedFormat, activeTab])

  const handleBorrowBook = (bookId: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              isBorrowed: true,
              isAvailable: false,
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            }
          : book,
      ),
    )
  }

  const handleReturnBook = (bookId: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              isBorrowed: false,
              isAvailable: true,
              dueDate: undefined,
            }
          : book,
      ),
    )
  }

  const handleReadBook = (book: DigitalBook) => {
    setSelectedBook(book)
    setIsReaderOpen(true)
  }

  const categories = ["all", ...Array.from(new Set(books.map((book) => book.category)))]
  const formats = ["all", "PDF", "EPUB", "MOBI"]
  const borrowedBooks = books.filter((book) => book.isBorrowed)

  if (isReaderOpen && selectedBook) {
    return (
      <DigitalBookReader
        book={selectedBook}
        onClose={() => {
          setIsReaderOpen(false)
          setSelectedBook(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Digital Book Lending</h1>
                <p className="text-sm text-gray-600">Browse and borrow digital books instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {borrowedBooks.length} Books Borrowed
              </Badge>
              <Badge variant="outline">{filteredBooks.filter((b) => b.isAvailable).length} Available</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search books by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format === "all" ? "All Formats" : format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Books ({filteredBooks.length})</TabsTrigger>
            <TabsTrigger value="borrowed">My Borrowed Books ({borrowedBooks.length})</TabsTrigger>
            <TabsTrigger value="available">
              Available Now ({filteredBooks.filter((b) => b.isAvailable).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 overflow-hidden">
                      <img
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm">by {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline">{book.format}</Badge>
                        <span className="text-gray-500">{book.fileSize}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{book.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{book.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{book.readingTime}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {book.isBorrowed ? (
                          <>
                            <Button size="sm" className="flex-1" onClick={() => handleReadBook(book)}>
                              <BookOpen className="h-4 w-4 mr-1" />
                              Read
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReturnBook(book.id)}>
                              Return
                            </Button>
                          </>
                        ) : book.isAvailable ? (
                          <Button size="sm" className="w-full" onClick={() => handleBorrowBook(book.id)}>
                            Borrow Now
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" disabled className="w-full">
                            Not Available
                          </Button>
                        )}
                      </div>

                      {book.isBorrowed && book.dueDate && (
                        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          Due: {new Date(book.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="borrowed" className="mt-6">
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
                <p className="text-gray-600 mb-4">Start browsing to borrow your first digital book!</p>
                <Button onClick={() => setActiveTab("browse")}>Browse Books</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowedBooks.map((book) => (
                  <Card key={book.id} className="border-blue-200 bg-blue-50/30">
                    <CardHeader className="pb-3">
                      <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 overflow-hidden">
                        <img
                          src={book.coverUrl || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => handleReadBook(book)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Continue Reading
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReturnBook(book.id)}>
                            Return
                          </Button>
                        </div>
                        {book.dueDate && (
                          <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks
                .filter((book) => book.isAvailable && !book.isBorrowed)
                .map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow border-green-200">
                    <CardHeader className="pb-3">
                      <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 overflow-hidden">
                        <img
                          src={book.coverUrl || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <Badge className="bg-green-100 text-green-800">Available Now</Badge>
                        <Button size="sm" className="w-full" onClick={() => handleBorrowBook(book.id)}>
                          Borrow Instantly
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
