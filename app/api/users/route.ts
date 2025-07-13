import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (in production, use a proper database)
const users: any[] = []
let nextUserId = 1

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Check if user already exists
    const existingUser = users.find((user) => user.username === username)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      username,
      password, // In production, hash the password
      created_at: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(
    users.map((user) => ({
      id: user.id,
      username: user.username,
      created_at: user.created_at,
    })),
  )
}
