// Shared in-memory data store
export const carts: any[] = []
export const orders: any[] = []
export let nextCartId = 1
export let nextOrderId = 1

export function getNextCartId() {
  return nextCartId++
}

export function getNextOrderId() {
  return nextOrderId++
}

// Items data
export const items = [
  { id: 1, name: "Laptop", description: "High-performance laptop for work and gaming", price: 999.99 },
  { id: 2, name: "Smartphone", description: "Latest smartphone with advanced features", price: 699.99 },
  { id: 3, name: "Headphones", description: "Wireless noise-cancelling headphones", price: 199.99 },
  { id: 4, name: "Tablet", description: "Lightweight tablet for productivity", price: 399.99 },
  { id: 5, name: "Smart Watch", description: "Fitness tracking smartwatch", price: 299.99 },
  { id: 6, name: "Camera", description: "Professional DSLR camera", price: 1299.99 },
]
