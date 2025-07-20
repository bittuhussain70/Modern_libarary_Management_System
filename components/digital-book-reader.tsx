"use client"

import { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut, Bookmark, Search, ChevronLeft, ChevronRight, Menu, Sun, Moon, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface DigitalBook {
  id: string
  title: string
  author: string
  pages: number
  format: string
}

interface DigitalBookReaderProps {
  book: DigitalBook
  onClose: () => void
}

export function DigitalBookReader({ book, onClose }: DigitalBookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [theme, setTheme] = useState<"light" | "dark" | "sepia">("light")
  const [fontSize, setFontSize] = useState(16)
  const [showSidebar, setShowSidebar] = useState(false)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [readingProgress, setReadingProgress] = useState(0)

  // Calculate reading progress
  useEffect(() => {
    const progress = (currentPage / book.pages) * 100
    setReadingProgress(progress)
  }, [currentPage, book.pages])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= book.pages) {
      setCurrentPage(page)
    }
  }

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0])
  }

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((page) => page !== currentPage))
    } else {
      setBookmarks([...bookmarks, currentPage])
    }
  }

  const goToBookmark = (page: number) => {
    setCurrentPage(page)
    setShowSidebar(false)
  }

  const themeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
    sepia: "bg-amber-50 text-amber-900",
  }

  const sidebarThemeClasses = {
    light: "bg-gray-50 border-gray-200",
    dark: "bg-gray-800 border-gray-700",
    sepia: "bg-amber-100 border-amber-200",
  }

  return (
    <div className={`fixed inset-0 z-50 ${themeClasses[theme]}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : theme === "sepia" ? "border-amber-200" : "border-gray-200"}`}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">{book.title}</h1>
            <p className="text-sm opacity-70">by {book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reading Progress */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span>
              Page {currentPage} of {book.pages}
            </span>
            <Badge variant="outline">{Math.round(readingProgress)}%</Badge>
          </div>

          {/* Theme Selector */}
          <Select value={theme} onValueChange={(value: "light" | "dark" | "sepia") => setTheme(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value="sepia">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Sepia
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        {showSidebar && (
          <div className={`w-80 border-r p-4 overflow-y-auto ${sidebarThemeClasses[theme]}`}>
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-medium mb-3">Search in Book</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Bookmarks */}
              <div>
                <h3 className="font-medium mb-3">Bookmarks ({bookmarks.length})</h3>
                {bookmarks.length === 0 ? (
                  <p className="text-sm opacity-70">No bookmarks yet</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((page) => (
                      <Card
                        key={page}
                        className="cursor-pointer hover:bg-opacity-80"
                        onClick={() => goToBookmark(page)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Page {page}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round((page / book.pages) * 100)}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Reading Settings */}
              <div>
                <h3 className="font-medium mb-3">Reading Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Font Size</label>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>12px</span>
                      <span>{fontSize}px</span>
                      <span>24px</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Zoom Level</label>
                    <Slider
                      value={[zoom]}
                      onValueChange={handleZoomChange}
                      min={50}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>50%</span>
                      <span>{zoom}%</span>
                      <span>200%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div
            className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-gray-700" : theme === "sepia" ? "border-amber-200" : "border-gray-200"}`}
          >
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleZoomChange([zoom - 10])}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => handleZoomChange([zoom + 10])}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBookmark}
                className={bookmarks.includes(currentPage) ? "text-blue-600" : ""}
              >
                <Bookmark className={`h-4 w-4 ${bookmarks.includes(currentPage) ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number.parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  min={1}
                  max={book.pages}
                />
                <span className="text-sm">of {book.pages}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === book.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Reading Area */}
          <div className="flex-1 overflow-auto p-8">
            <div
              className="max-w-4xl mx-auto"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
              }}
            >
              {/* Mock Book Content */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Chapter {Math.ceil(currentPage / 10)}: Sample Content</h2>

                <p>
                  This is a sample page ({currentPage}) of the digital book "{book.title}" by {book.author}. In a real
                  implementation, this would display the actual book content based on the current page number.
                </p>

                <p>The digital book reader supports various features including:</p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adjustable zoom levels from 50% to 200%</li>
                  <li>Multiple reading themes (Light, Dark, Sepia)</li>
                  <li>Bookmarking system for important pages</li>
                  <li>Full-text search capabilities</li>
                  <li>Customizable font sizes</li>
                  <li>Reading progress tracking</li>
                </ul>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>

                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </p>

                {currentPage % 5 === 0 && (
                  <div
                    className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : theme === "sepia" ? "bg-amber-100" : "bg-gray-100"}`}
                  >
                    <h3 className="font-semibold mb-2">Key Point</h3>
                    <p>This is a highlighted section that appears every 5 pages to demonstrate content variation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : theme === "sepia" ? "border-amber-200" : "border-gray-200"}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm min-w-[100px]">Progress: {Math.round(readingProgress)}%</span>
              <div className="flex-1">
                <Slider
                  value={[currentPage]}
                  onValueChange={(value) => handlePageChange(value[0])}
                  min={1}
                  max={book.pages}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="text-sm min-w-[80px] text-right">
                {currentPage}/{book.pages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
