document.addEventListener("DOMContentLoaded", () => {
  
  function isLoggedIn() {

    return true 
  }


  function getItems() {
    return [] 
  }


  function getCarts() {
    return [] 
  }


  function getCurrentUserId() {
    return 1 
  }

  
  function getNextCartId() {
    return 1 
  }

 
  function saveCarts(carts) {
    console.log(carts)
  }

 
  function getOrders() {
    return [] 
  }

  function getNextOrderId() {
    return 1
  }

  
  function saveOrders(orders) {
    console.log(orders)
  }
  function logout() {
    console.log("Logging out")
  }

  if (!isLoggedIn()) {
    window.location.href = "index.html"
    return
  }

  const checkoutBtn = document.getElementById("checkout-btn")
  const cartBtn = document.getElementById("cart-btn")
  const ordersBtn = document.getElementById("orders-btn")
  const logoutBtn = document.getElementById("logout-btn")

  checkoutBtn.addEventListener("click", checkout)
  cartBtn.addEventListener("click", () => (window.location.href = "cart.html"))
  ordersBtn.addEventListener("click", () => (window.location.href = "orders.html"))
  logoutBtn.addEventListener("click", handleLogout)

  displayItems()
})

function displayItems() {
  const itemsGrid = document.getElementById("items-grid")
  const items = getItems()

  items.forEach((item) => {
    const itemCard = document.createElement("div")
    itemCard.className = "item-card"
    itemCard.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="item-footer">
        <span class="item-price">$${item.price}</span>
        <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    `
    itemsGrid.appendChild(itemCard)
  })
}

function addToCart(itemId) {
  const items = getItems()
  const item = items.find((i) => i.id === itemId)

  if (!item) {
    showToast("Item not found", "error")
    return
  }

  const carts = getCarts()
  const userId = getCurrentUserId()

  let userCart = carts.find((cart) => cart.user_id === userId)

  if (!userCart) {
    userCart = {
      id: getNextCartId(),
      user_id: userId,
      items: [],
      created_at: new Date().toISOString(),
    }
    carts.push(userCart)
  }

  userCart.items.push({
    cart_id: userCart.id,
    item_id: itemId,
    item_name: item.name,
    added_at: new Date().toISOString(),
  })

  saveCarts(carts)
  showToast("Item added to cart!", "success")
}

function checkout() {
  const carts = getCarts()
  const userId = getCurrentUserId()
  const userCart = carts.find((cart) => cart.user_id === userId)

  if (!userCart || userCart.items.length === 0) {
    showToast("Cart is empty", "error")
    return
  }

  const orders = getOrders()
  const newOrder = {
    id: getNextOrderId(),
    user_id: userId,
    cart_id: userCart.id,
    items: [...userCart.items],
    status: "completed",
    created_at: new Date().toISOString(),
  }

  orders.push(newOrder)
  saveOrders(orders)

  userCart.items = []
  saveCarts(carts)

  showToast("Order successful!", "success")
}

function handleLogout() {
  logout()
  window.location.href = "index.html"
}

function showToast(message, type) {
  const toast = document.getElementById("toast")
  toast.className = `toast ${type}`
  toast.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}
