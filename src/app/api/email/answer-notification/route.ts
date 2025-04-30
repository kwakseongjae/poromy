import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import AnswerNotification from '@/emails/answer-notification'

const resend = new Resend(process.env.RESEND_API_KEY)
const appUrl = process.env.APP_URL || 'http://localhost:3000'
const testEmail = process.env.TEST_EMAIL || 'gkffhdnls13@gmail.com'

interface AnswerRequest {
  inquiry: {
    id: string
    title: string
    userNickname: string
  }
  answer: {
    content: string
    url: string | null
  }
  userEmail: string
}

export async function POST(request: Request) {
  try {
    const { inquiry, answer, userEmail } =
      (await request.json()) as AnswerRequest

    // 유효성 검사
    if (!inquiry.title || !answer.content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 이메일 발송 (테스트 이메일로만 전송)
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: testEmail, // 테스트 이메일로만 전송
      subject: `[포로미] 문의하신 "${inquiry.title}"에 답변이 등록되었습니다.`,
      react: AnswerNotification({
        inquiryTitle: inquiry.title,
        answerContent: answer.content,
        answerUrl: answer.url || undefined,
        userNickname: inquiry.userNickname || '사용자',
        appUrl,
      }),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('이메일 발송 중 오류 발생:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
