const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// TypeScript 파일을 JavaScript로 변환
const tsConfig = {
  compilerOptions: {
    target: 'es5',
    module: 'commonjs',
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    outDir: 'temp',
    baseUrl: '.',
    rootDir: '.',
    paths: {
      '@/*': ['src/*'],
    },
  },
  include: [
    'src/constants/company.data.ts',
    'src/types/company.ts',
    'src/utils/prompt.ts',
    'src/utils/crypto.ts',
  ],
}

// 임시 tsconfig.json 생성
fs.writeFileSync(
  path.join(process.cwd(), 'tsconfig.temp.json'),
  JSON.stringify(tsConfig, null, 2)
)

try {
  // tsc로 변환
  execSync('pnpm exec tsc --project tsconfig.temp.json', { stdio: 'inherit' })

  // companies 데이터 변환
  const jsContent = fs.readFileSync(
    path.join(process.cwd(), 'temp/src/constants/company.data.js'),
    'utf-8'
  )

  // companies 데이터만 추출
  const companiesMatch = jsContent.match(/exports\.companies = (\[[\s\S]*?\]);/)
  if (!companiesMatch) {
    throw new Error('Could not find companies data in the converted file')
  }

  // 최종 파일 생성
  const modifiedContent = `const companies = ${companiesMatch[1]};\n\nmodule.exports = { companies };`

  // 최종 파일 저장
  fs.writeFileSync(
    path.join(process.cwd(), 'temp/company.data.js'),
    modifiedContent
  )

  // crypto 모듈 변환
  const cryptoContent = fs.readFileSync(
    path.join(process.cwd(), 'temp/src/utils/crypto.js'),
    'utf-8'
  )

  // crypto 모듈 저장
  fs.writeFileSync(path.join(process.cwd(), 'temp/crypto.js'), cryptoContent)

  console.log(
    'Company data and crypto module successfully converted to JavaScript'
  )
} catch (error) {
  console.error('Error converting files:', error)
  process.exit(1)
} finally {
  // 임시 tsconfig 파일만 정리
  fs.unlinkSync(path.join(process.cwd(), 'tsconfig.temp.json'))
}
