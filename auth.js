let isLoginMode = true

function getUsers() {

  return JSON.parse(localStorage.getItem("users")) || []
}

function generateToken(userId) {

  localStorage.setItem("token", `user-${userId}`)
}

function getNextUserId() {

  const users = getUsers()
  return users.length > 0 ? users[users.length - 1].id + 1 : 1
}

function saveUsers(users) {

  localStorage.setItem("users", JSON.stringify(users))
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form")
  const toggleBtn = document.getElementById("toggle-form")
  const formTitle = document.getElementById("form-title")
  const formDescription = document.getElementById("form-description")
  const submitBtn = document.getElementById("submit-btn")

  form.addEventListener("submit", handleSubmit)
  toggleBtn.addEventListener("click", toggleMode)

  function toggleMode() {
    isLoginMode = !isLoginMode

    if (isLoginMode) {
      formTitle.textContent = "Login"
      formDescription.textContent = "Enter your credentials to access the store"
      submitBtn.textContent = "Login"
      toggleBtn.textContent = "Don't have an account? Sign up"
    } else {
      formTitle.textContent = "Sign Up"
      formDescription.textContent = "Create a new account"
      submitBtn.textContent = "Sign Up"
      toggleBtn.textContent = "Already have an account? Login"
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    submitBtn.disabled = true
    submitBtn.textContent = "Loading..."

    setTimeout(() => {
      if (isLoginMode) {
        handleLogin(username, password)
      } else {
        handleSignup(username, password)
      }

      submitBtn.disabled = false
      submitBtn.textContent = isLoginMode ? "Login" : "Sign Up"
    }, 500)
  }

  function handleLogin(username, password) {
    const users = getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      generateToken(user.id)
      window.location.href = "items.html"
    } else {
      alert("Invalid username/password")
    }
  }

  function handleSignup(username, password) {
    const users = getUsers()
    const existingUser = users.find((u) => u.username === username)

    if (existingUser) {
      showToast("User already exists", "error")
      return
    }

    const newUser = {
      id: getNextUserId(),
      username,
      password,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    showToast("User created successfully! Please login.", "success")
    toggleMode()
    form.reset()
  }
})

function showToast(message, type) {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => toast.classList.add("show"), 100)
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 3000)
}
