/**
 * Centralized error handling for admin features
 */

export enum AdminErrorCode {
  // Authentication errors
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Operation errors
  OPERATION_FAILED = 'OPERATION_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',

  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface AdminErrorOptions {
  code: AdminErrorCode
  message: string
  details?: any
  statusCode?: number
}

export class AdminError extends Error {
  public readonly code: AdminErrorCode
  public readonly details?: any
  public readonly statusCode: number
  public readonly timestamp: Date

  constructor(options: AdminErrorOptions) {
    super(options.message)
    this.name = 'AdminError'
    this.code = options.code
    this.details = options.details
    this.statusCode =
      options.statusCode || this.getDefaultStatusCode(options.code)
    this.timestamp = new Date()
  }

  private getDefaultStatusCode(code: AdminErrorCode): number {
    switch (code) {
      case AdminErrorCode.NOT_AUTHENTICATED:
        return 401
      case AdminErrorCode.NOT_AUTHORIZED:
      case AdminErrorCode.RATE_LIMIT_EXCEEDED:
        return 403
      case AdminErrorCode.RESOURCE_NOT_FOUND:
        return 404
      case AdminErrorCode.DUPLICATE_RESOURCE:
        return 409
      case AdminErrorCode.VALIDATION_ERROR:
        return 400
      case AdminErrorCode.DATABASE_ERROR:
      case AdminErrorCode.NETWORK_ERROR:
      case AdminErrorCode.INTERNAL_ERROR:
      case AdminErrorCode.OPERATION_FAILED:
      default:
        return 500
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    }
  }
}

/**
 * Error message templates for consistent messaging
 */
export const AdminErrorMessages = {
  // Authentication
  NOT_AUTHENTICATED: '인증이 필요합니다. 다시 로그인해주세요.',
  NOT_AUTHORIZED: '관리자 권한이 필요합니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',

  // Operations
  OPERATION_FAILED: '작업을 수행하는 중 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력한 데이터가 올바르지 않습니다.',
  RESOURCE_NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  DUPLICATE_RESOURCE: '이미 존재하는 리소스입니다.',

  // System
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 연결에 문제가 있습니다.',
  INTERNAL_ERROR: '서버 내부 오류가 발생했습니다.',
  RATE_LIMIT_EXCEEDED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
} as const

/**
 * Helper functions for common error scenarios
 */
export const AdminErrorHelpers = {
  notAuthenticated: (details?: any) =>
    new AdminError({
      code: AdminErrorCode.NOT_AUTHENTICATED,
      message: AdminErrorMessages.NOT_AUTHENTICATED,
      details,
    }),

  notAuthorized: (details?: any) =>
    new AdminError({
      code: AdminErrorCode.NOT_AUTHORIZED,
      message: AdminErrorMessages.NOT_AUTHORIZED,
      details,
    }),

  validationError: (message: string, details?: any) =>
    new AdminError({
      code: AdminErrorCode.VALIDATION_ERROR,
      message,
      details,
    }),

  operationFailed: (message: string, details?: any) =>
    new AdminError({
      code: AdminErrorCode.OPERATION_FAILED,
      message,
      details,
    }),

  resourceNotFound: (resourceType: string, id?: string) =>
    new AdminError({
      code: AdminErrorCode.RESOURCE_NOT_FOUND,
      message: `${resourceType}을(를) 찾을 수 없습니다.`,
      details: { resourceType, id },
    }),

  databaseError: (error: any) =>
    new AdminError({
      code: AdminErrorCode.DATABASE_ERROR,
      message: AdminErrorMessages.DATABASE_ERROR,
      details: error,
    }),

  internalError: (error: any) =>
    new AdminError({
      code: AdminErrorCode.INTERNAL_ERROR,
      message: AdminErrorMessages.INTERNAL_ERROR,
      details: error,
    }),
}

/**
 * Error handler for API routes
 */
export function handleAdminApiError(error: unknown) {
  console.error('[Admin API Error]', error)

  if (error instanceof AdminError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: error.timestamp,
        },
      },
      { status: error.statusCode }
    )
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any

    if (supabaseError.code === 'PGRST301') {
      return Response.json(
        {
          error: {
            code: AdminErrorCode.NOT_AUTHENTICATED,
            message: AdminErrorMessages.NOT_AUTHENTICATED,
          },
        },
        { status: 401 }
      )
    }

    if (supabaseError.code === '23505') {
      return Response.json(
        {
          error: {
            code: AdminErrorCode.DUPLICATE_RESOURCE,
            message: AdminErrorMessages.DUPLICATE_RESOURCE,
          },
        },
        { status: 409 }
      )
    }
  }

  // Default error response
  return Response.json(
    {
      error: {
        code: AdminErrorCode.INTERNAL_ERROR,
        message: AdminErrorMessages.INTERNAL_ERROR,
      },
    },
    { status: 500 }
  )
}

/**
 * Error handler for client-side components
 */
export function handleAdminClientError(
  error: unknown,
  options?: {
    showToast?: boolean
    logError?: boolean
  }
) {
  const { showToast = true, logError = true } = options || {}

  if (logError) {
    console.error('[Admin Client Error]', error)
  }

  let message: string = AdminErrorMessages.INTERNAL_ERROR
  let code = AdminErrorCode.INTERNAL_ERROR

  if (error instanceof AdminError) {
    message = error.message
    code = error.code
  } else if (error instanceof Error) {
    message = error.message
  }

  // You can integrate with your toast notification system here
  if (showToast) {
    // Example: toast.error(message)
    console.error(`Toast: ${message}`)
  }

  return { message, code }
}
