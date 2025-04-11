/**
 * Encryption and Decryption Utility
 * Encrypts job posting IDs for use in URLs and decrypts them to obtain the original ID.
 */

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set')
}

/**
 * Encrypts a string.
 * @param text The string to encrypt
 * @returns The encrypted string
 */
export function encrypt(text: string): string {
  try {
    // Simple encryption method (a stronger encryption algorithm is recommended for production)
    const encodedText = encodeURIComponent(text)
    const encrypted = btoa(encodedText + ENCRYPTION_KEY)
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch (error) {
    console.error('Encryption error:', error)
    return ''
  }
}

/**
 * Decrypts an encrypted string.
 * @param encrypted The encrypted string
 * @returns The decrypted string
 */
export function decrypt(encrypted: string): string {
  try {
    // Convert the encrypted string back to its original format
    const base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64)
    const decrypted = decoded.slice(0, -ENCRYPTION_KEY!.length)
    return decodeURIComponent(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    return ''
  }
}
