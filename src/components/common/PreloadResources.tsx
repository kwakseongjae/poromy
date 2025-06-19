/**
 * PreloadResources Component
 * 중요한 리소스들을 프리로드하여 초기 페이지 로딩 성능을 개선합니다.
 * - 폰트 파일 프리로드 (강화된 캐싱)
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
        media="all"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-Medium.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        media="all"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-SemiBold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        media="all"
      />
      <link
        rel="preload"
        href="/fonts/Pretendard-Bold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        media="all"
      />

      {/* 📱 폰트 prefetch 추가 (브라우저 캐시 강화) */}
      <link
        rel="prefetch"
        href="/fonts/Pretendard-Regular.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="prefetch"
        href="/fonts/Pretendard-Medium.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="prefetch"
        href="/fonts/Pretendard-SemiBold.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="prefetch"
        href="/fonts/Pretendard-Bold.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
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
