document.addEventListener("DOMContentLoaded", () => {

  function isLoggedIn() {
    return true 
  }

  function getOrders() {
    return [] 
  }

  function getCurrentUserId() {
    return 1 
  }

  if (!isLoggedIn()) {
    window.location.href = "index.html"
    return
  }

  const backBtn = document.getElementById("back-btn")
  const startShoppingBtn = document.getElementById("start-shopping")

  backBtn.addEventListener("click", () => (window.location.href = "items.html"))
  if (startShoppingBtn) {
    startShoppingBtn.addEventListener("click", () => (window.location.href = "items.html"))
  }

  displayOrders()
})

function displayOrders() {
  const orders = getOrders()
  const userId = getCurrentUserId()
  const userOrders = orders.filter((order) => order.user_id === userId)

  const emptyOrders = document.getElementById("empty-orders")
  const ordersList = document.getElementById("orders-list")

  if (userOrders.length === 0) {
    emptyOrders.style.display = "block"
  } else {
    emptyOrders.style.display = "none"

    userOrders.forEach((order) => {
      const orderCard = document.createElement("div")
      orderCard.className = "order-card"

      const orderDate = new Date(order.created_at)
      const dateStr = orderDate.toLocaleDateString()
      const timeStr = orderDate.toLocaleTimeString()

      orderCard.innerHTML = `
        <div class="order-header">
          <div>
            <div class="order-title">
              <h3>Order #${order.id}</h3>
              <span class="badge completed">${order.status}</span>
            </div>
            <div class="order-date">${dateStr} at ${timeStr}</div>
          </div>
          <div class="order-meta">Cart ID: ${order.cart_id}</div>
        </div>
        <div class="order-items">
          <h4>Items (${order.items.length}):</h4>
          ${order.items
            .map(
              (item) => `
            <div class="order-item">
              <span class="order-item-name">${item.item_name}</span>
              <span class="order-item-id">ID: ${item.item_id}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `
      ordersList.appendChild(orderCard)
    })
  }
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
