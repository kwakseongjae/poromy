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

interface VerificationEmailProps {
  verificationUrl: string
  token: string
  appUrl: string
}

export const VerificationEmail = ({
  verificationUrl,
  token,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>포로미 이메일 인증</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>이메일 인증</Heading>

          <Section style={section}>
            <Text style={text}>
              안녕하세요! 포로미 회원가입을 완료하기 위해 이메일 인증이
              필요합니다.
            </Text>

            <Text style={text}>
              아래 버튼을 클릭하여 이메일 인증을 완료해주세요.
            </Text>

            <Section style={buttonContainer}>
              <Link href={verificationUrl} style={button}>
                이메일 인증하기
              </Link>
            </Section>

            <Text style={text}>
              또는 아래 링크를 복사하여 브라우저에 붙여넣기 하세요:
            </Text>

            <Text style={url}>{verificationUrl}</Text>

            <Hr style={hr} />

            <Text style={text}>
              만약 버튼이 작동하지 않는다면, 아래 인증 코드를 사용하세요:
            </Text>

            <Text style={tokenStyle}>{token}</Text>

            <Text style={text}>
              이 인증 코드는 24시간 동안 유효합니다. 만료되면 다시 인증 이메일을
              요청해야 합니다.
            </Text>
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

const text = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
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

const url = {
  color: '#0070f3',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f9f9f9',
  padding: '12px',
  borderRadius: '4px',
}

const tokenStyle = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  backgroundColor: '#f9f9f9',
  padding: '12px',
  borderRadius: '4px',
  margin: '16px 0',
}

const hr = {
  borderColor: '#eee',
  margin: '24px 0',
}

const footer = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

export default VerificationEmail
