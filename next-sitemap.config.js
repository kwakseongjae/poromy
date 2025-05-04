/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://poromy.ai.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
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
    const result = []

    // 메인 페이지
    result.push({
      loc: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
    })

    // 기타 중요 페이지
    const importantPages = [
      { path: 'company', priority: 0.8 },
      { path: 'inquiry', priority: 0.8 },
      { path: 'position', priority: 0.8 },
      { path: 'login', priority: 0.5 },
      { path: 'signup', priority: 0.5 },
    ]

    importantPages.forEach(({ path, priority }) => {
      result.push({
        loc: `/${path}`,
        priority,
        changefreq: 'daily',
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
}
