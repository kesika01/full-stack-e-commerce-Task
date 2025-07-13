const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use(express.static("."))

const users = [
  { id: 1, username: "demo", password: "password", created_at: new Date().toISOString() },
  { id: 2, username: "user1", password: "pass123", created_at: new Date().toISOString() },
]

const items = [
  { id: 1, name: "Laptop", description: "High-performance laptop for work and gaming", price: 999.99 },
  { id: 2, name: "Smartphone", description: "Latest smartphone with advanced features", price: 699.99 },
  { id: 3, name: "Headphones", description: "Wireless noise-cancelling headphones", price: 199.99 },
  { id: 4, name: "Tablet", description: "Lightweight tablet for productivity", price: 399.99 },
  { id: 5, name: "Smart Watch", description: "Fitness tracking smartwatch", price: 299.99 },
  { id: 6, name: "Camera", description: "Professional DSLR camera", price: 1299.99 },
]

const userTokens = new Map()
const carts = []
const orders = []
let nextUserId = 3
let nextCartId = 1
let nextOrderId = 1

function generateToken(userId) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  userTokens.set(userId, token)
  return token
}

function getUserIdFromToken(token) {
  for (const [id, t] of userTokens.entries()) {
    if (t === token) return id
  }
  return null
}

function getUserFromToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null
  const token = authHeader.slice(7)
  const userId = getUserIdFromToken(token)
  return userId ? { userId } : null
}

app.post("/api/users", (req, res) => {
  const { username, password } = req.body

  const existingUser = users.find((user) => user.username === username)
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password,
    created_at: new Date().toISOString(),
  }

  users.push(newUser)
  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    message: "User created successfully",
  })
})

app.get("/api/users", (req, res) => {
  res.json(
    users.map((user) => ({
      id: user.id,
      username: user.username,
      created_at: user.created_at,
    })),
  )
})

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body

  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = generateToken(user.id)
  res.json({
    token,
    userId: user.id,
    username: user.username,
  })
})

app.get("/api/items", (req, res) => {
  res.json(items)
})

app.post("/api/items", (req, res) => {
  const { name, description, price } = req.body

  const newItem = {
    id: items.length + 1,
    name,
    description,
    price: Number.parseFloat(price),
  }

  items.push(newItem)
  res.status(201).json(newItem)
})

app.post("/api/carts", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { item_id } = req.body

  const item = items.find((i) => i.id === item_id)
  if (!item) {
    return res.status(404).json({ error: "Item not found" })
  }

  let userCart = carts.find((cart) => cart.user_id === user.userId)
  if (!userCart) {
    userCart = {
      id: nextCartId++,
      user_id: user.userId,
      items: [],
      created_at: new Date().toISOString(),
    }
    carts.push(userCart)
  }

  userCart.items.push({
    cart_id: userCart.id,
    item_id: item_id,
    item_name: item.name,
    added_at: new Date().toISOString(),
  })

  res.json({ message: "Item added to cart", cart_id: userCart.id })
})

app.get("/api/carts", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const userCart = carts.find((cart) => cart.user_id === user.userId)
  if (!userCart) {
    return res.json([])
  }

  res.json(userCart.items)
})

app.post("/api/orders", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const userCart = carts.find((cart) => cart.user_id === user.userId)
  if (!userCart || userCart.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" })
  }

  const newOrder = {
    id: nextOrderId++,
    user_id: user.userId,
    cart_id: userCart.id,
    items: [...userCart.items],
    status: "completed",
    created_at: new Date().toISOString(),
  }

  orders.push(newOrder)
  userCart.items = []

  res.json({
    message: "Order created successfully",
    order_id: newOrder.id,
  })
})

app.get("/api/orders", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const userOrders = orders.filter((order) => order.user_id === user.userId)
  res.json(userOrders)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
