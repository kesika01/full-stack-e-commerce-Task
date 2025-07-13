import { type NextRequest, NextResponse } from "next/server"
import { getUserIdFromToken } from "@/lib/auth"
import { carts, orders, getNextOrderId } from "@/lib/data"

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
    // Find user's cart
    const userCart = carts.find((cart) => cart.user_id === user.userId)
    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Create order from cart
    const newOrder = {
      id: getNextOrderId(),
      user_id: user.userId,
      cart_id: userCart.id,
      items: [...userCart.items],
      status: "completed",
      created_at: new Date().toISOString(),
    }

    orders.push(newOrder)

    // Clear the cart after creating order
    userCart.items = []

    return NextResponse.json({
      message: "Order created successfully",
      order_id: newOrder.id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userOrders = orders.filter((order) => order.user_id === user.userId)
  return NextResponse.json(userOrders)
}
