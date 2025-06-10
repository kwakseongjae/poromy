const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL과 Service Key가 필요합니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// job.data.ts에서 jobs 배열을 동적으로 가져오기
async function getJobsData() {
  try {
    // job.data.ts 파일의 경로
    const jobDataPath = path.join(__dirname, '../src/constants/job.data.ts')

    // 파일 내용 읽기
    const fileContent = fs.readFileSync(jobDataPath, 'utf-8')

    // TypeScript 파일을 일시적으로 JavaScript로 변환하여 로드
    // 더 간단한 방법: 정규식으로 jobs 배열 추출
    const jobsMatch = fileContent.match(
      /export const jobs[^=]*=\s*(\[[\s\S]*?\n\])/m
    )

    if (!jobsMatch) {
      throw new Error('jobs 배열을 찾을 수 없습니다.')
    }

    // getPositionPrompt 함수 참조를 제거하고 jobs 배열만 추출
    let jobsArrayStr = jobsMatch[1]

    // prompt 함수 참조를 제거 (마이그레이션에서는 프롬프트 파일을 별도로 읽음)
    jobsArrayStr = jobsArrayStr.replace(
      /prompt:\s*\(\)\s*=>\s*getPositionPrompt\(['"`](\d+)['"`]\),?/g,
      ''
    )

    // eval을 사용하여 JavaScript 배열로 파싱 (개발용)
    // 보안상 주의: 프로덕션에서는 JSON.parse나 안전한 파서 사용
    const jobs = eval('(' + jobsArrayStr + ')')

    return jobs
  } catch (error) {
    console.error('job.data.ts 파일을 읽는 중 오류 발생:', error)
    throw error
  }
}

// 프롬프트 파일 읽기
async function readPromptFile(id) {
  try {
    const promptPath = path.join(
      __dirname,
      `../public/prompts/position/${id}.md`
    )

    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, 'utf-8')
    }

    return null
  } catch (error) {
    console.error(`프롬프트 파일 ${id}.md를 읽는 중 오류 발생:`, error)
    return null
  }
}

// 단일 job 데이터를 Supabase에 삽입
async function insertJob(job) {
  try {
    // 프롬프트 내용 가져오기
    const promptContent = await readPromptFile(job.id)

    // job 데이터를 Supabase 스키마에 맞게 변환 (id는 autoincrement되므로 제외)
    const jobData = {
      company_name: job.companyName,
      job_title: job.jobTitle,
      conditions: job.conditions || [],
      job_type: job.jobType,
      position_description: job.positionDescription,
      main_task: job.mainTask,
      qualifications: job.qualifications || [],
      preferred_qualifications: job.preferredQualifications || [],
      logo_url: job.logoUrl,
      url: job.url,
      prompt_content: promptContent,
      uploaded_at: job.uploadedAt,
      deadline: job.deadline,
    }

    const { data, error } = await supabase.from('jobs').insert(jobData).select()

    if (error) {
      console.error(
        `Job (${job.companyName} - ${job.jobTitle}) 삽입 중 오류:`,
        error
      )
      return false
    }

    const insertedId = data && data[0] ? data[0].id : 'unknown'
    console.log(
      `✅ Job ID ${insertedId} (${job.companyName} - ${job.jobTitle}) 성공적으로 삽입됨`
    )
    return true
  } catch (error) {
    console.error(
      `Job (${job.companyName} - ${job.jobTitle}) 처리 중 예외 발생:`,
      error
    )
    return false
  }
}

// 모든 jobs 데이터를 Supabase로 마이그레이션
async function migrateAllJobs() {
  try {
    console.log('🚀 채용공고 데이터 마이그레이션을 시작합니다...')

    const jobs = await getJobsData()
    console.log(`📊 총 ${jobs.length}개의 채용공고를 마이그레이션합니다.`)

    let successCount = 0
    let failCount = 0

    // 배치 처리 (한 번에 5개씩)
    const batchSize = 5
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize)

      console.log(
        `\n📦 배치 ${Math.floor(i / batchSize) + 1} 처리 중... (${i + 1}-${Math.min(i + batchSize, jobs.length)} / ${jobs.length})`
      )

      const promises = batch.map((job) => insertJob(job))
      const results = await Promise.all(promises)

      successCount += results.filter(Boolean).length
      failCount += results.filter((result) => !result).length

      // API 레이트 리미트를 위한 약간의 대기
      if (i + batchSize < jobs.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    console.log('\n🎉 마이그레이션 완료!')
    console.log(`✅ 성공: ${successCount}개`)
    console.log(`❌ 실패: ${failCount}개`)

    if (failCount > 0) {
      console.log(
        '\n⚠️  일부 데이터 마이그레이션이 실패했습니다. 로그를 확인해주세요.'
      )
    }
  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error)
    throw error
  }
}

// 특정 job만 마이그레이션 (테스트용)
async function migrateSingleJob(localJobId) {
  try {
    const jobs = await getJobsData()
    const job = jobs.find((j) => j.id === localJobId)

    if (!job) {
      console.error(`❌ 로컬 Job ID ${localJobId}를 찾을 수 없습니다.`)
      return
    }

    console.log(
      `🔄 Job (${job.companyName} - ${job.jobTitle}) 마이그레이션 중...`
    )
    const success = await insertJob(job)

    if (success) {
      console.log(
        `✅ Job (${job.companyName} - ${job.jobTitle}) 마이그레이션 완료`
      )
    } else {
      console.log(
        `❌ Job (${job.companyName} - ${job.jobTitle}) 마이그레이션 실패`
      )
    }
  } catch (error) {
    console.error('❌ 단일 job 마이그레이션 중 오류:', error)
  }
}

// CLI 실행
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // 모든 jobs 마이그레이션
    await migrateAllJobs()
  } else if (args[0] === '--single' && args[1]) {
    // 특정 job 마이그레이션
    await migrateSingleJob(args[1])
  } else {
    console.log('사용법:')
    console.log('  모든 jobs 마이그레이션: node migrate-jobs-to-supabase.js')
    console.log(
      '  특정 job 마이그레이션: node migrate-jobs-to-supabase.js --single [JOB_ID]'
    )
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch((error) => {
    console.error('스크립트 실행 중 오류:', error)
    process.exit(1)
  })
}

module.exports = {
  migrateAllJobs,
  migrateSingleJob,
  insertJob,
}
