import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"

// In-memory storage
let users: any[] = []

// Initialize with some demo users
if (users.length === 0) {
  users = [
    { id: 1, username: "demo", password: "password", created_at: new Date().toISOString() },
    { id: 2, username: "user1", password: "pass123", created_at: new Date().toISOString() },
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = users.find((u) => u.username === username && u.password === password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token (in production, use a proper secret)
    const token = generateToken(user.id)

    return NextResponse.json({
      token,
      userId: user.id,
      username: user.username,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
