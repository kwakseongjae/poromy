'use client'

import { useRef, RefObject } from 'react'
import { Dialog } from '@/components/ui/Dialog'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  buttonRef: RefObject<HTMLButtonElement | null>
}

export const HelpModal = ({
  isOpen,
  onClose,
  title,
  description,
  buttonRef,
}: HelpModalProps) => {
  const getPosition = () => {
    if (!buttonRef.current) return { top: '0', right: '0' }

    const rect = buttonRef.current.getBoundingClientRect()
    return {
      top: `${rect.bottom + 10}px`,
      right: `${window.innerWidth - rect.right}px`,
    }
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} position={getPosition()}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>{description}</p>
          <div className="mt-4">
            <h4 className="font-medium">사용 방법</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>프롬프트를 복사합니다.</li>
              <li>
                선호하는 AI 솔루션(GPT, Claude, Perplexity 등)에서 새 채팅을
                시작합니다.
              </li>
              <li>복사한 프롬프트를 붙여넣기 합니다.</li>
              <li>AI가 생성한 지원서를 확인하고 필요한 경우 수정합니다.</li>
            </ol>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
