import { type NextRequest, NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { carts, getNextCartId, items } from "@/lib/data"

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null
  const token = authHeader.slice(7)
  const userId = getUserIdFromToken(token)
  return userId ? { userId } : null
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { item_id } = await request.json()

    // Find the item
    const item = items.find((i) => i.id === item_id)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Find or create user's cart
    let userCart = carts.find((cart) => cart.user_id === user.userId)
    if (!userCart) {
      userCart = {
        id: getNextCartId(),
        user_id: user.userId,
        items: [],
        created_at: new Date().toISOString(),
      }
      carts.push(userCart)
    }

    // Add item to cart
    userCart.items.push({
      cart_id: userCart.id,
      item_id: item_id,
      item_name: item.name,
      added_at: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Item added to cart", cart_id: userCart.id })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userCart = carts.find((cart) => cart.user_id === user.userId)
  if (!userCart) {
    return NextResponse.json([])
  }

  return NextResponse.json(userCart.items)
}
