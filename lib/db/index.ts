import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/library_db"

// Create the connection
const client = postgres(connectionString)

// Create the database instance
export const db = drizzle(client)
