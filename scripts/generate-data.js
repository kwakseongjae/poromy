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
    'src/constants/job.data.ts',
    'src/types/company.ts',
    'src/types/job.ts',
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
  const companiesContent = fs.readFileSync(
    path.join(process.cwd(), 'temp/src/constants/company.data.js'),
    'utf-8'
  )

  // companies 데이터만 추출
  const companiesMatch = companiesContent.match(
    /exports\.companies = (\[[\s\S]*?\]);/
  )
  if (!companiesMatch) {
    throw new Error('Could not find companies data in the converted file')
  }

  // companies 최종 파일 생성
  const companiesModifiedContent = `const companies = ${companiesMatch[1]};\n\nmodule.exports = { companies };`

  // companies 최종 파일 저장
  fs.writeFileSync(
    path.join(process.cwd(), 'temp/company.data.js'),
    companiesModifiedContent
  )

  // jobs 데이터 변환
  const jobsContent = fs.readFileSync(
    path.join(process.cwd(), 'temp/src/constants/job.data.js'),
    'utf-8'
  )

  // jobs 데이터만 추출
  const jobsMatch = jobsContent.match(/exports\.jobs = (\[[\s\S]*?\]);/)
  if (!jobsMatch) {
    throw new Error('Could not find jobs data in the converted file')
  }

  // jobs 최종 파일 생성
  const jobsModifiedContent = `const jobs = ${jobsMatch[1]};\n\nmodule.exports = { jobs };`

  // jobs 최종 파일 저장
  fs.writeFileSync(
    path.join(process.cwd(), 'temp/job.data.js'),
    jobsModifiedContent
  )

  // crypto 모듈 변환
  const cryptoContent = fs.readFileSync(
    path.join(process.cwd(), 'temp/src/utils/crypto.js'),
    'utf-8'
  )

  // crypto 모듈 저장
  fs.writeFileSync(path.join(process.cwd(), 'temp/crypto.js'), cryptoContent)

  console.log(
    'Company data, job data, and crypto module successfully converted to JavaScript'
  )
} catch (error) {
  console.error('Error converting files:', error)
  process.exit(1)
} finally {
  // 임시 tsconfig 파일만 정리
  fs.unlinkSync(path.join(process.cwd(), 'tsconfig.temp.json'))
}
