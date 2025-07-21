'use client'

import { Component, ReactNode } from 'react'
import { AdminError, AdminErrorCode, handleAdminClientError } from '@/utils/admin-errors'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error('[AdminErrorBoundary] Error caught:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
    })

    // Handle the error
    handleAdminClientError(error, {
      showToast: false, // Don't show toast in error boundary
      logError: true,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }

      // Determine error type and message
      let errorTitle = '오류가 발생했습니다'
      let errorMessage = '예상치 못한 오류가 발생했습니다.'
      let errorCode = ''

      if (this.state.error instanceof AdminError) {
        errorCode = this.state.error.code
        errorMessage = this.state.error.message

        switch (this.state.error.code) {
          case AdminErrorCode.NOT_AUTHENTICATED:
          case AdminErrorCode.NOT_AUTHORIZED:
            errorTitle = '권한 오류'
            break
          case AdminErrorCode.NETWORK_ERROR:
            errorTitle = '네트워크 오류'
            break
          case AdminErrorCode.DATABASE_ERROR:
            errorTitle = '데이터베이스 오류'
            break
          default:
            errorTitle = '시스템 오류'
        }
      } else if (this.state.error instanceof Error) {
        errorMessage = this.state.error.message
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
              {errorTitle}
            </h2>

            <p className="mb-6 text-center text-gray-600">
              {errorMessage}
            </p>

            {errorCode && (
              <p className="mb-6 text-center text-sm text-gray-500">
                오류 코드: {errorCode}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                다시 시도
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                홈으로 돌아가기
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 rounded-md bg-gray-100 p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  오류 상세 정보 (개발 환경)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-600">
                  {JSON.stringify(
                    {
                      name: this.state.error.name,
                      message: this.state.error.message,
                      stack: this.state.error.stack,
                    },
                    null,
                    2
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}