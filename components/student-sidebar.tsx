"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Search,
  Heart,
  Clock,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Calendar,
  Award,
  Bell,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"

const studentNavItems = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: BookOpen,
  },
  {
    title: "Browse Books",
    href: "/student/browse",
    icon: Search,
  },
  {
    title: "My Books",
    href: "/student/my-books",
    icon: Clock,
    badge: "5",
  },
  {
    title: "Favorites",
    href: "/student/favorites",
    icon: Heart,
    badge: "12",
  },
  {
    title: "Reading History",
    href: "/student/history",
    icon: Award,
  },
  {
    title: "Reservations",
    href: "/student/reservations",
    icon: Calendar,
    badge: "2",
  },
  {
    title: "Reviews",
    href: "/student/reviews",
    icon: Star,
  },
  {
    title: "Notifications",
    href: "/student/notifications",
    icon: Bell,
    badge: "3",
  },
]

export function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">College Library</h2>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || user?.email?.split("@")[0]}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  Student
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {studentNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Link
              href="/student/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
