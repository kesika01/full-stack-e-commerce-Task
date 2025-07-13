import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for items
const items = [
  { id: 1, name: "Laptop", description: "High-performance laptop for work and gaming", price: 999.99 },
  { id: 2, name: "Smartphone", description: "Latest smartphone with advanced features", price: 699.99 },
  { id: 3, name: "Headphones", description: "Wireless noise-cancelling headphones", price: 199.99 },
  { id: 4, name: "Tablet", description: "Lightweight tablet for productivity", price: 399.99 },
  { id: 5, name: "Smart Watch", description: "Fitness tracking smartwatch", price: 299.99 },
  { id: 6, name: "Camera", description: "Professional DSLR camera", price: 1299.99 },
]
let nextItemId = 7

export async function GET() {
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price } = await request.json()

    const newItem = {
      id: nextItemId++,
      name,
      description,
      price: Number.parseFloat(price),
    }

    items.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
