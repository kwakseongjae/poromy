/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://poromy.ai.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // 인덱스 사이트맵 대신 일반 사이트맵 생성
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/auth/*'],
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/api/*', '/auth/*'],
  additionalPaths: async (config) => {
    // 추가 경로를 수동으로 정의
    const result = []

    // 메인 페이지
    result.push({
      loc: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
    })

    // 기타 중요 페이지
    ;['company', 'inquiry', 'position', 'login', 'signup'].forEach((path) => {
      result.push({
        loc: `/${path}`,
        priority: path === 'login' || path === 'signup' ? 0.5 : 0.8,
        changefreq: 'daily',
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
  transform: async (config, path) => {
    // 기본 우선순위 설정
    let priority = config.priority

    // 메인 페이지는 최우선
    if (path === '/') {
      priority = 1.0
    }
    // 기업 및 채용 공고 페이지는 높은 우선순위
    else if (path.startsWith('/company') || path.startsWith('/position')) {
      priority = 0.8
    }
    // 문의 페이지는 중간 우선순위
    else if (path.startsWith('/inquiry')) {
      priority = 0.8
    }
    // 로그인/회원가입은 낮은 우선순위
    else if (path.startsWith('/login') || path.startsWith('/signup')) {
      priority = 0.5
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
