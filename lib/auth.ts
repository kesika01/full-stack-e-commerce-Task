export const userTokens = new Map<number, string>()

/** Issue a new (single-device) token */
export function generateToken(userId: number) {
  const token = crypto.randomUUID()
  userTokens.set(userId, token) // one token per user
  return token
}

/** Resolve a userId from a bearer token or return null */
export function getUserIdFromToken(token: string): number | null {
  for (const [id, t] of userTokens.entries()) {
    if (t === token) return id
  }
  return null
}
