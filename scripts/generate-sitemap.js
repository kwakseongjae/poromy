const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' })

// Company IDs 정의 (import 의존성 제거)
const companyIds = [
  'hanwha_solutions',
  'sk_hynix',
  'hyundai_motors',
  'gs_construction',
  'samsung_display',
  'krafton',
  'hana_bank',
  'lg_electronics',
  'samsung_sdi',
  'samsung_sds',
  'kakao',
  'naver'
]

// 암호화 함수 정의 (환경변수 사용)
function encrypt(text) {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'poromy-secret-key-2025'
  const encodedText = encodeURIComponent(text)
  const combined = encodedText + key
  const base64 = Buffer.from(combined).toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * 빌드 시 정적 sitemap.xml 생성 스크립트
 * Supabase 데이터를 가져와 public 폴더에 sitemap.xml 파일을 생성합니다.
 */
async function generateSitemap() {
  console.log('🚀 사이트맵 생성을 시작합니다...')
  
  try {
    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 모든 채용공고 데이터 가져오기 (필터링 조건 제거)
    console.log('📊 채용공고 데이터를 가져오는 중...')
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 채용공고 데이터 가져오기 실패:', error)
      throw error
    }

    console.log(`✅ ${jobs.length}개의 활성 채용공고를 발견했습니다.`)

    // 사이트맵 XML 생성
    const siteUrl = 'https://poromy.ai.kr'
    const currentDate = new Date().toISOString()
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // 메인 페이지들 추가
    const mainPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/company', priority: '0.8', changefreq: 'weekly' },
      { url: '/position', priority: '0.8', changefreq: 'daily' },
      { url: '/inquiry', priority: '0.8', changefreq: 'monthly' },
      { url: '/auth/login', priority: '0.5', changefreq: 'monthly' },
      { url: '/auth/signup', priority: '0.5', changefreq: 'monthly' },
      { url: '/rss', priority: '0.7', changefreq: 'daily' }
    ]

    mainPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // 회사별 페이지 추가
    console.log(`📄 ${companyIds.length}개의 회사 페이지를 추가하는 중...`)
    companyIds.forEach(companyId => {
      const encryptedId = encrypt(companyId)
      sitemap += `
  <url>
    <loc>${siteUrl}/company/${encryptedId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    })

    // 채용공고별 페이지 추가
    console.log(`📄 ${jobs.length}개의 채용공고 페이지를 추가하는 중...`)
    jobs.forEach(job => {
      const encryptedId = encrypt(job.id.toString())
      sitemap += `
  <url>
    <loc>${siteUrl}/position/${encryptedId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    // public 폴더에 sitemap.xml 저장
    const publicDir = path.join(process.cwd(), 'public')
    const sitemapPath = path.join(publicDir, 'sitemap.xml')
    
    // public 디렉토리가 없으면 생성
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(sitemapPath, sitemap, 'utf8')

    console.log('✅ 사이트맵 생성 완료!')
    console.log(`📊 총 URL 개수: ${mainPages.length + companyIds.length + jobs.length}개`)
    console.log(`   - 메인 페이지: ${mainPages.length}개`)
    console.log(`   - 회사 페이지: ${companyIds.length}개`)
    console.log(`   - 채용공고 페이지: ${jobs.length}개`)
    console.log(`📁 파일 경로: ${sitemapPath}`)

  } catch (error) {
    console.error('❌ 사이트맵 생성 중 오류 발생:', error)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  generateSitemap()
}

module.exports = { generateSitemap }