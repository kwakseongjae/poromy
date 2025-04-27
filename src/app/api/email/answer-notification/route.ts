import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import AnswerNotification from '@/emails/answer-notification'

const resend = new Resend(process.env.RESEND_API_KEY)
const appUrl = process.env.APP_URL || 'http://localhost:3000'

interface AnswerRequest {
  inquiryTitle: string
  content: string
  url?: string
  userEmail: string
  userNickname: string
}

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const { answer } = (await request.json()) as { answer: AnswerRequest }

    // 유효성 검사
    if (!answer.userEmail || !answer.content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 이메일 발송
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Resend 기본 도메인 또는 설정한 도메인
      to: answer.userEmail,
      subject: `[답변 완료] ${answer.inquiryTitle}`,
      react: AnswerNotification({
        inquiryTitle: answer.inquiryTitle,
        answerContent: answer.content,
        answerUrl: answer.url,
        userNickname: answer.userNickname || '고객',
        appUrl,
      }),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
