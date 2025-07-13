"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart } from "lucide-react"

interface CartItem {
  cart_id: number
  item_id: number
  item_name: string
  added_at: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    fetchCartItems()
  }, [router])

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("/api/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch cart items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkout = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order successful!",
        })
        // Refresh cart items after checkout
        fetchCartItems()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push("/items")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Items
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-4">Add some items to your cart to get started!</p>
              <Button onClick={() => router.push("/items")}>Continue Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {cartItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.item_name}</CardTitle>
                        <CardDescription>Added on {new Date(item.added_at).toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="text-sm text-gray-500">
                        Cart ID: {item.cart_id} | Item ID: {item.item_id}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total Items: {cartItems.length}</div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push("/items")}>
                  Continue Shopping
                </Button>
                <Button onClick={checkout} className="bg-green-600 hover:bg-green-700">
                  Checkout ({cartItems.length} items)
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
