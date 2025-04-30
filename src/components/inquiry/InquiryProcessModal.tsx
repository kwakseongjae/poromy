'use client'

import { useState, useRef } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { ExclamationIcon } from '@/assets'

export const InquiryProcessModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation() // 이벤트 버블링 방지
    setIsOpen((prev) => !prev)
  }

  const getPosition = () => {
    if (!buttonRef.current) return { top: '0', right: '0' }

    const rect = buttonRef.current.getBoundingClientRect()
    return {
      top: `${rect.top}px`,
      left: `${rect.right + 10}px`,
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="cursor-pointer"
        onClick={handleToggle}
        aria-label="문의 프로세스 확인"
      >
        <ExclamationIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      </button>

      <Dialog isOpen={isOpen} onClose={handleToggle} position={getPosition()}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">문의 프로세스 안내</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">
                채용 지원까지 시간 여유가 있으시다면 아직 업로드 되지 않은 채용
                공고를 요청해보세요!
              </span>
            </p>
            <p>
              1. <span className="text-text-secondary font-semibold">30초</span>{' '}
              간편 문의 작성
            </p>
            <p>2. 이메일로 문의 등록 확인</p>
            <p>
              3.{' '}
              <span className="text-text-secondary font-semibold">
                24시간 이내
              </span>{' '}
              문의 답변
            </p>
            <p>4. 이메일로 문의 답변 확인</p>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
