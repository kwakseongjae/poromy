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

/**
 * 이미지 크기가 작으면 최적화를 생략할지 결정
 * 10KB 미만, SVG, GIF는 최적화 생략 권장
 */
export const shouldOptimizeImage = (
  url: string,
  width?: number,
  height?: number
): boolean => {
  // SVG 파일은 최적화 생략
  if (url.toLowerCase().includes('.svg')) return false

  // GIF 애니메이션은 최적화 생략
  if (url.toLowerCase().includes('.gif')) return false

  // 작은 이미지는 최적화 생략 (64px 이하)
  if (width && height && (width <= 64 || height <= 64)) return false

  return true
}

/**
 * 최소 크기의 블러 플레이스홀더 생성
 * 더 작은 base64 데이터로 번들 크기 최적화
 */
export const getMinimalBlurDataURL = (): string => {
  // 4x3 픽셀의 최소 JPEG
  return 'data:image/jpeg;base64,/9j/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHB8fHx8fHx8fHx//2wBDAQcHBw0MDRgQEBgaFREVGiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAABAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0A'
}
