'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

// Zod 스키마 정의 - TypeScript 타입 안전성과 런타임 검증을 모두 제공
const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.')
      .max(100, '이메일은 최대 100자까지 입력 가능합니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(50, '비밀번호는 최대 50자까지 입력 가능합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        '비밀번호는 영문과 숫자를 포함해야 합니다.'
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(20, '닉네임은 최대 20자까지 입력 가능합니다.')
      .regex(
        /^[가-힣a-zA-Z0-9_]+$/,
        '닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.'
      ),
  })
  .refine(
    (data: { password: string; passwordConfirm: string }) =>
      data.password === data.passwordConfirm,
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['passwordConfirm'], // 에러를 passwordConfirm 필드에 할당
    }
  )

// TypeScript 타입 추론 - Zod 스키마에서 자동으로 타입 생성
type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const { user } = useSupabase()

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema), // Zod resolver로 유효성 검사
    mode: 'onChange', // 실시간 검증 - 사용자 경험 향상
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
    },
  })

  // 로그인된 사용자 리다이렉션 처리
  useEffect(() => {
    if (user) {
      const returnUrl = localStorage.getItem('returnUrl')
      localStorage.removeItem('returnUrl')

      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/')
      }
    }
  }, [user, router])

  // 폼 제출 핸들러 - TypeScript로 타입 안전성 보장
  const onSubmit: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData
  ) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      // 1. 사용자 생성 (이메일 인증 포함)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nickname: data.nickname,
          },
          emailRedirectTo: 'https://poromy.ai.kr/login',
        },
      })

      if (authError) {
        console.error('Auth Error:', authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('회원가입 중 오류가 발생했습니다.')
      }

      // 프로필 생성 API 호출
      const profileResponse = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: data.email,
          nickname: data.nickname,
          is_verified: false,
        }),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        console.log(errorData)
        throw new Error(errorData.error || '이미 사용 중인 이메일입니다.')
      }

      // 2. 성공 처리
      setSubmitSuccess(
        '이메일 인증 링크를 발송했습니다. 이메일을 확인해주세요.'
      )
      reset() // 폼 초기화

      // 3. 이메일 인증 페이지로 리다이렉트
      router.push('/verify-email')
    } catch (error: any) {
      console.error('회원가입 오류:', error)

      // 에러 메시지를 더 구체적으로 처리
      let errorMessage = '회원가입 중 오류가 발생했습니다.'

      if (error?.message) {
        const message = error.message.toLowerCase()

        // 이메일 중복 에러 처리
        if (
          message.includes('프로필 생성 중 오류가 발생했습니다.') ||
          message.includes('user already registered') ||
          message.includes('email already') ||
          message.includes('already been taken') ||
          message.includes('duplicate') ||
          message.includes('이미 사용')
        ) {
          errorMessage =
            '이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.'
        }
        // 네트워크 에러 처리
        else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인해주세요.'
        }
        // 비밀번호 관련 에러 처리
        else if (message.includes('password') && message.includes('weak')) {
          errorMessage =
            '비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.'
        }
        // 이메일 형식 에러 처리
        else if (
          message.includes('invalid email') ||
          message.includes('email format')
        ) {
          errorMessage = '올바른 이메일 형식이 아닙니다.'
        }
        // 서버 에러 처리
        else if (
          message.includes('500') ||
          message.includes('internal server')
        ) {
          errorMessage =
            '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        }
        // 그 외의 경우 원본 메시지 사용 (단, 사용자 친화적으로 변경)
        else {
          errorMessage = error.message || errorMessage
        }
      }

      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 헬퍼 함수: 필드별 에러 메시지 표시
  const getFieldError = (fieldName: keyof SignUpFormData) => {
    return errors[fieldName]?.message
  }

  // 헬퍼 함수: 필드별 입력값 검증 상태
  const getFieldValidationClass = (fieldName: keyof SignUpFormData) => {
    const hasError = !!errors[fieldName]
    const hasValue = !!watch(fieldName)

    if (!hasValue) return 'border-gray-300'
    if (hasError) return 'border-red-500'
    return 'border-green-500'
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h1 className="mt-4 mb-8 text-center text-xl font-bold">
        Poromy 회원가입
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 이메일 필드 */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            이메일 *
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className={`w-full rounded border p-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${getFieldValidationClass('email')}`}
            placeholder="이메일을 입력해주세요."
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {getFieldError('email')}
            </p>
          )}
        </div>

        {/* 비밀번호 필드 */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            비밀번호 *
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={`w-full rounded border p-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${getFieldValidationClass('password')}`}
            placeholder="비밀번호를 입력해주세요."
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p
              id="password-error"
              className="mt-1 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {getFieldError('password')}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 필드 */}
        <div className="mb-4">
          <label
            htmlFor="passwordConfirm"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            비밀번호 확인 *
          </label>
          <input
            {...register('passwordConfirm')}
            id="passwordConfirm"
            type="password"
            className={`w-full rounded border p-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${getFieldValidationClass('passwordConfirm')}`}
            placeholder="비밀번호를 다시 입력해주세요."
            aria-invalid={!!errors.passwordConfirm}
            aria-describedby={
              errors.passwordConfirm ? 'password-confirm-error' : undefined
            }
          />
          {errors.passwordConfirm && (
            <p
              id="password-confirm-error"
              className="mt-1 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {getFieldError('passwordConfirm')}
            </p>
          )}
        </div>

        {/* 닉네임 필드 */}
        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            닉네임 *
          </label>
          <input
            {...register('nickname')}
            id="nickname"
            type="text"
            className={`w-full rounded border p-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${getFieldValidationClass('nickname')}`}
            placeholder="닉네임을 입력해주세요."
            maxLength={20}
            aria-invalid={!!errors.nickname}
            aria-describedby={errors.nickname ? 'nickname-error' : undefined}
          />
          {errors.nickname && (
            <p
              id="nickname-error"
              className="mt-1 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {getFieldError('nickname')}
            </p>
          )}
        </div>

        {/* 에러 메시지 표시 */}
        {submitError && (
          <div
            className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {submitError}
          </div>
        )}

        {/* 성공 메시지 표시 */}
        {submitSuccess && (
          <div
            className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600"
            role="alert"
            aria-live="polite"
          >
            {submitSuccess}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="mt-12">
          <button
            type="submit"
            className={`w-full rounded p-2 font-bold text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
              isValid && !isSubmitting
                ? 'cursor-pointer bg-blue-500 hover:bg-blue-600'
                : 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={!isValid || isSubmitting}
            aria-label={
              !isValid ? '모든 필드를 올바르게 입력해주세요' : '회원가입'
            }
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
        </div>

        {/* 로그인 링크 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              로그인
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
