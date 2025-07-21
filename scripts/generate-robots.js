const fs = require('fs')
const path = require('path')

/**
 * robots.txt 파일 생성 스크립트
 * 기존 설정과 동일한 robots.txt를 생성합니다.
 */
function generateRobots() {
  console.log('🤖 robots.txt 생성을 시작합니다...')
  
  try {
    const siteUrl = 'https://poromy.ai.kr'
    
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/*
Disallow: /auth/*
Disallow: /position?id=*

User-agent: Googlebot
Allow: /
Allow: /position/*
Disallow: /api/*
Disallow: /auth/*
Disallow: /position?id=*

User-agent: Yeti
Allow: /
Allow: /position/*
Disallow: /api/*
Disallow: /auth/*
Disallow: /position?id=*

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/rss`

    // public 폴더에 robots.txt 저장
    const publicDir = path.join(process.cwd(), 'public')
    const robotsPath = path.join(publicDir, 'robots.txt')
    
    // public 디렉토리가 없으면 생성
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(robotsPath, robotsTxt, 'utf8')

    console.log('✅ robots.txt 생성 완료!')
    console.log(`📁 파일 경로: ${robotsPath}`)

  } catch (error) {
    console.error('❌ robots.txt 생성 중 오류 발생:', error)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  generateRobots()
}

module.exports = { generateRobots }