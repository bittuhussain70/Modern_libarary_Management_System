"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  FileText,
  Mail,
  Shield,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Books Management",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    title: "Student Management",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Loan Management",
    href: "/admin/loans",
    icon: UserCheck,
  },
  {
    title: "Registrations",
    href: "/admin/registrations",
    icon: FileText,
    badge: "5",
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Email Test",
    href: "/admin/email-test",
    icon: Mail,
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user || (user.role !== "admin" && user.role !== "librarian")) {
    return null
  }

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
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Library Admin</h2>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || user?.email?.split("@")[0]}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="destructive" className="text-xs mt-1">
                  {user.role === "admin" ? "Administrator" : "Librarian"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminNavItems.map((item) => {
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
              href="/admin/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Admin Settings
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
