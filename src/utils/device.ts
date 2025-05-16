/**
 * Returns true if the user agent string is from a mobile device.
 *
 * @param userAgent - User agent string (e.g., from HTTP headers)
 * @returns True if mobile, false otherwise
 *
 * @example isMobileDevice('Mozilla/5.0 (iPhone...)') // true
 * @example isMobileDevice('Mozilla/5.0 (Macintosh...)') // false
 */
export const isMobileDevice = (userAgent: string): boolean => {
  const mobileRegex =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/i
  return mobileRegex.test(userAgent)
}
