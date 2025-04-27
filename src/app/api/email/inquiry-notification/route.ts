import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import InquiryNotification from '@/emails/inquiry-notification'

const resend = new Resend(process.env.RESEND_API_KEY)
const adminEmail = process.env.ADMIN_EMAIL
const appUrl = process.env.APP_URL || 'http://localhost:3000'

interface InquiryRequest {
  id: string
  title: string
  content: string
  url?: string
  userEmail: string
  userNickname: string
}

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const { inquiry } = (await request.json()) as { inquiry: InquiryRequest }

    // 유효성 검사
    if (!adminEmail) {
      return NextResponse.json(
        { error: '관리자 이메일이 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    if (!inquiry.title || !inquiry.content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 이메일 발송
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Resend 기본 도메인 또는 설정한 도메인
      to: adminEmail,
      subject: `[새 문의] ${inquiry.title}`,
      react: InquiryNotification({
        inquiryId: inquiry.id,
        title: inquiry.title,
        content: inquiry.content,
        url: inquiry.url,
        userEmail: inquiry.userEmail,
        userNickname: inquiry.userNickname,
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
