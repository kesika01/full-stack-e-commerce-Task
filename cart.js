document.addEventListener("DOMContentLoaded", () => {

  function isLoggedIn() {

    return true 
  }


  function getCarts() {
  
    return []
  }

  function getCurrentUserId() {
  
    return 1 
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

  function saveCarts(carts) {
 
    console.log(carts) 
  }

  if (!isLoggedIn()) {
    window.location.href = "index.html"
    return
  }

  const backBtn = document.getElementById("back-btn")
  const continueShoppingBtns = document.querySelectorAll("#continue-shopping, #continue-shopping-2")
  const checkoutBtn = document.getElementById("checkout-cart")

  backBtn.addEventListener("click", () => (window.location.href = "items.html"))
  continueShoppingBtns.forEach((btn) => {
    btn.addEventListener("click", () => (window.location.href = "items.html"))
  })
  checkoutBtn.addEventListener("click", checkout)

  displayCartItems()
})

function displayCartItems() {
  const carts = getCarts()
  const userId = getCurrentUserId()
  const userCart = carts.find((cart) => cart.user_id === userId)

  const emptyCart = document.getElementById("empty-cart")
  const cartItemsContainer = document.getElementById("cart-items")
  const cartFooter = document.getElementById("cart-footer")
  const totalItems = document.getElementById("total-items")
  const checkoutBtn = document.getElementById("checkout-cart")

  if (!userCart || userCart.items.length === 0) {
    emptyCart.style.display = "block"
    cartFooter.style.display = "none"
  } else {
    emptyCart.style.display = "none"
    cartFooter.style.display = "flex"

    userCart.items.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
        <div class="cart-item-header">
          <div>
            <h3>${item.item_name}</h3>
            <p>Added on ${new Date(item.added_at).toLocaleDateString()}</p>
          </div>
          <div class="cart-item-meta">
            Cart ID: ${item.cart_id} | Item ID: ${item.item_id}
          </div>
        </div>
      `
      cartItemsContainer.appendChild(cartItem)
    })

    totalItems.textContent = `Total Items: ${userCart.items.length}`
    checkoutBtn.textContent = `Checkout (${userCart.items.length} items)`
  }
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
  setTimeout(() => {
    window.location.reload()
  }, 1500)
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
