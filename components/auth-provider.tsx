"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string
  role: "admin" | "librarian" | "student"
  studentId?: string
  department?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  extendSession: () => void
  getSessionInfo: () => {
    loginTime: number | null
    sessionDuration: number
    lastActivity: number
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@college.edu",
    name: "Library Administrator",
    role: "admin",
  },
  {
    id: "2",
    email: "librarian@college.edu",
    name: "Head Librarian",
    role: "librarian",
  },
  {
    id: "3",
    email: "student@college.edu",
    name: "John Doe",
    role: "student",
    studentId: "CS2024001",
    department: "Computer Science",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("library_user")
    const loginTime = localStorage.getItem("library_login_time")

    if (storedUser && loginTime) {
      try {
        const parsedUser = JSON.parse(storedUser)
        const loginTimestamp = Number.parseInt(loginTime)
        const now = Date.now()
        const sessionAge = now - loginTimestamp

        // Check if session is older than 24 hours (max session time)
        const MAX_SESSION_TIME = 24 * 60 * 60 * 1000 // 24 hours

        if (sessionAge < MAX_SESSION_TIME) {
          setUser(parsedUser)
          console.log(`Session restored. Age: ${Math.floor(sessionAge / (1000 * 60))} minutes`)
        } else {
          console.log("Session expired (24 hour limit)")
          localStorage.removeItem("library_user")
          localStorage.removeItem("library_login_time")
          localStorage.removeItem("library_last_activity")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("library_user")
        localStorage.removeItem("library_login_time")
        localStorage.removeItem("library_last_activity")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user in mock data
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "password123") {
      const now = Date.now()
      setUser(foundUser)
      localStorage.setItem("library_user", JSON.stringify(foundUser))
      localStorage.setItem("library_login_time", now.toString())
      localStorage.setItem("library_last_activity", now.toString())

      console.log(`User logged in: ${foundUser.email} (${foundUser.role})`)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    console.log("User logged out")
    setUser(null)
    localStorage.removeItem("library_user")
    localStorage.removeItem("library_login_time")
    localStorage.removeItem("library_last_activity")

    // Clear any other session-related data
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("library_")) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("library_user", JSON.stringify(updatedUser))
    }
  }

  const extendSession = () => {
    const now = Date.now()
    localStorage.setItem("library_last_activity", now.toString())
    console.log("Session extended")
  }

  const getSessionInfo = () => {
    const loginTime = localStorage.getItem("library_login_time")
    const lastActivity = localStorage.getItem("library_last_activity")

    return {
      loginTime: loginTime ? Number.parseInt(loginTime) : null,
      sessionDuration: loginTime ? Date.now() - Number.parseInt(loginTime) : 0,
      lastActivity: lastActivity ? Number.parseInt(lastActivity) : Date.now(),
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        extendSession,
        getSessionInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
