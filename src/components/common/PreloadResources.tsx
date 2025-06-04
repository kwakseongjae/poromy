/**
 * PreloadResources Component
 * 중요한 리소스들을 프리로드하여 초기 페이지 로딩 성능을 개선합니다.
 * - 폰트 파일 프리로드
 * - 중요 이미지 프리로드
 * - 외부 도메인 DNS 프리페치
 */
export const PreloadResources = () => {
  return (
    <>
      {/* 폰트 프리로드 - Pretendard 폰트 패밀리 */}
      <link
        rel="preload"
        href="/fonts/Pretendard-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-Medium.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-SemiBold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* 메인 페이지 캐러셀 이미지 프리로드 */}
      <link
        rel="preload"
        as="image"
        href="/images/home-carousel-1.png"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/home-carousel-2.png"
        fetchPriority="high"
      />

      {/* OG 이미지 프리로드 (소셜 미디어 공유 시 빠른 로딩) */}
      <link
        rel="preload"
        as="image"
        href={`/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`}
        fetchPriority="low"
      />

      {/* DNS 프리페치 - 외부 서비스 도메인 */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Supabase 도메인 프리커넥트  */}
      <link rel="preconnect" href="https://supabase.co" />

      {/* Google Analytics 프리커넥트 */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
    </>
  )
}
