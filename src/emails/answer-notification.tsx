import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Hr,
  Text,
  Heading,
  Link,
  Preview,
} from '@react-email/components'

interface AnswerNotificationProps {
  inquiryTitle: string
  answerContent: string
  answerUrl?: string
  userNickname: string
  appUrl: string
}

export const AnswerNotification = ({
  inquiryTitle,
  answerContent,
  answerUrl,
  userNickname,
  appUrl = 'http://localhost:3000',
}: AnswerNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>{userNickname}님, 문의하신 내용에 답변이 등록되었습니다</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {userNickname}님, 문의하신 내용에 답변이 등록되었습니다
          </Heading>

          <Section style={section}>
            <Text style={titleStyle}>
              <strong>문의 제목:</strong> {inquiryTitle}
            </Text>

            <Hr style={hr} />

            <Text style={contentHeader}>
              <strong>답변 내용:</strong>
            </Text>
            <Text style={contentStyle}>{answerContent}</Text>

            {answerUrl && (
              <Text>
                <strong>참조 URL:</strong>{' '}
                <Link href={answerUrl} style={link}>
                  {answerUrl}
                </Link>
              </Text>
            )}
          </Section>

          <Section style={buttonContainer}>
            <Link href={`${appUrl}/inquiry`} style={button}>
              모든 문의 보기
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            이 이메일은 자동으로 발송되었습니다. 추가 문의 사항은 웹사이트를
            통해 새로운 문의를 등록해 주세요.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// 스타일 정의
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '24px',
  borderRadius: '4px',
  border: '1px solid #eee',
  maxWidth: '580px',
}

const section = {
  marginBottom: '24px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0',
}

const titleStyle = {
  fontSize: '18px',
  color: '#0070f3',
  margin: '16px 0',
}

const contentHeader = {
  color: '#333',
  fontSize: '16px',
  margin: '16px 0 8px 0',
}

const contentStyle = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '24px',
  backgroundColor: '#f9f9f9',
  padding: '12px',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap',
}

const hr = {
  borderColor: '#eee',
  margin: '24px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
}

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
}

const footer = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

export default AnswerNotification
