function initializeData() {
  if (!localStorage.getItem("users")) {
    const defaultUsers = [
      { id: 1, username: "demo", password: "password", created_at: new Date().toISOString() },
      { id: 2, username: "user1", password: "pass123", created_at: new Date().toISOString() },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem("items")) {
    const defaultItems = [
      { id: 1, name: "Laptop", description: "High-performance laptop for work and gaming", price: 999.99 },
      { id: 2, name: "Smartphone", description: "Latest smartphone with advanced features", price: 699.99 },
      { id: 3, name: "Headphones", description: "Wireless noise-cancelling headphones", price: 199.99 },
      { id: 4, name: "Tablet", description: "Lightweight tablet for productivity", price: 399.99 },
      { id: 5, name: "Smart Watch", description: "Fitness tracking smartwatch", price: 299.99 },
      { id: 6, name: "Camera", description: "Professional DSLR camera", price: 1299.99 },
    ]
    localStorage.setItem("items", JSON.stringify(defaultItems))
  }

  if (!localStorage.getItem("carts")) {
    localStorage.setItem("carts", JSON.stringify([]))
  }

  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]))
  }

  if (!localStorage.getItem("nextUserId")) {
    localStorage.setItem("nextUserId", "3")
  }

  if (!localStorage.getItem("nextCartId")) {
    localStorage.setItem("nextCartId", "1")
  }

  if (!localStorage.getItem("nextOrderId")) {
    localStorage.setItem("nextOrderId", "1")
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function getItems() {
  return JSON.parse(localStorage.getItem("items") || "[]")
}

function getCarts() {
  return JSON.parse(localStorage.getItem("carts") || "[]")
}

function saveCarts(carts) {
  localStorage.setItem("carts", JSON.stringify(carts))
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]")
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders))
}

function getNextUserId() {
  const id = Number.parseInt(localStorage.getItem("nextUserId") || "1")
  localStorage.setItem("nextUserId", (id + 1).toString())
  return id
}

function getNextCartId() {
  const id = Number.parseInt(localStorage.getItem("nextCartId") || "1")
  localStorage.setItem("nextCartId", (id + 1).toString())
  return id
}

function getNextOrderId() {
  const id = Number.parseInt(localStorage.getItem("nextOrderId") || "1")
  localStorage.setItem("nextOrderId", (id + 1).toString())
  return id
}

function generateToken(userId) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  localStorage.setItem("userToken", token)
  localStorage.setItem("currentUserId", userId.toString())
  return token
}

function getCurrentUserId() {
  return Number.parseInt(localStorage.getItem("currentUserId") || "0")
}

function isLoggedIn() {
  return localStorage.getItem("userToken") && localStorage.getItem("currentUserId")
}

function logout() {
  localStorage.removeItem("userToken")
  localStorage.removeItem("currentUserId")
}

initializeData()
