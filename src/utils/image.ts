/**
 * Utility function to convert an image URL to a proxy URL
 *
 * @param originalUrl - The original image URL
 * @returns Image URL through the proxy
 *
 * @example
 * ```tsx
 * <Image
 *   src={getProxyImageUrl('https://example.com/image.jpg')}
 *   alt="Description"
 *   width={100}
 *   height={100}
 * />
 * ```
 */
export const getProxyImageUrl = (originalUrl: string): string => {
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
}
