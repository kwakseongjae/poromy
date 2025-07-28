/**
 * PreloadResources Component
 * 전역으로 필요한 핵심 리소스만 프리로드합니다.
 * - 폰트 파일 프리로드
 * - 외부 도메인 DNS 프리페치
 */
export const PreloadResources = () => {
  return (
    <>
      {/* 🚀 폰트 프리로드 최적화 - Pretendard 폰트 패밀리 */}
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

      {/* DNS 프리페치 - 외부 서비스 도메인 */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Supabase 도메인 프리커넥트  */}
      <link rel="dns-prefetch" href="https://jcebfbrgdtxbcsgpkvca.supabase.co" />
      <link rel="preconnect" href="https://jcebfbrgdtxbcsgpkvca.supabase.co" />

      {/* Google Analytics 프리커넥트 */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
    </>
  )
}

/**
 * 홈페이지 전용 이미지 프리로드 컴포넌트
 */
export const HomePreloadResources = () => {
  return (
    <>
      {/* 🖼️ 홈 캐러셀 이미지 프리로드 (LCP 최적화) */}
      <link
        rel="preload"
        href="/images/home-carousel-1.png"
        as="image"
        type="image/png"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/images/home-carousel-2.png"
        as="image"
        type="image/png"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/images/home-carousel-3.png"
        as="image"
        type="image/png"
      />

      {/* 🎨 로고 프리로드 */}
      <link
        rel="preload"
        href="/svg/logo-icon.svg"
        as="image"
        type="image/svg+xml"
      />
    </>
  )
}
