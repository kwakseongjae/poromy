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

interface InquiryNotificationProps {
  inquiryId: string
  title: string
  content: string
  url?: string
  userEmail: string
  userNickname: string
  appUrl: string
}

export const InquiryNotification = ({
  inquiryId,
  title,
  content,
  url,
  userEmail,
  userNickname,
  appUrl = 'http://localhost:3000',
}: InquiryNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>새로운 문의가 등록되었습니다: {title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>새로운 문의가 등록되었습니다</Heading>

          <Section style={section}>
            <Text style={titleStyle}>
              <strong>제목:</strong> {title}
            </Text>
            <Text style={infoText}>
              <strong>작성자:</strong> {userNickname} ({userEmail})
            </Text>

            <Hr style={hr} />

            <Text style={contentHeader}>
              <strong>문의 내용:</strong>
            </Text>
            <Text style={contentStyle}>{content}</Text>

            {url && (
              <Text>
                <strong>URL:</strong>{' '}
                <Link href={url} style={link}>
                  {url}
                </Link>
              </Text>
            )}
          </Section>

          <Section style={buttonContainer}>
            <Link href={`${appUrl}/inquiry/${inquiryId}`} style={button}>
              문의 상세 페이지에서 답변하기
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            이 이메일은 자동으로 발송되었습니다. 회신하지 마세요.
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

const infoText = {
  color: '#666',
  fontSize: '14px',
  margin: '8px 0',
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

export default InquiryNotification
