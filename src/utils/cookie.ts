/**
 * Gets a cookie value by name
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

/**
 * Sets a cookie with optional expiration and path
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param options - Optional settings for the cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    expires?: Date
    maxAge?: number
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}
) => {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure,
    sameSite = 'lax',
  } = options

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`
  }

  cookieString += `; path=${path}`

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += `; secure`
  }

  cookieString += `; samesite=${sameSite}`

  document.cookie = cookieString
}

/**
 * Deletes a cookie by setting its max-age to 0
 * @param name - The name of the cookie to delete
 * @param path - The path of the cookie (defaults to '/')
 */
export const deleteCookie = (name: string, path: string = '/') => {
  document.cookie = `${name}=; path=${path}; max-age=0`
}

/**
 * Checks if a cookie exists
 * @param name - The name of the cookie to check
 * @returns True if the cookie exists, false otherwise
 */
export const cookieExists = (name: string): boolean => {
  return getCookie(name) !== null
}
