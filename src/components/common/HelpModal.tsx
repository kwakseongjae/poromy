'use client'

import { useRef, RefObject } from 'react'
import { Dialog } from '@/components/ui/Dialog'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  buttonRef: RefObject<HTMLButtonElement | null>
  type: 'company' | 'position'
}

export const HelpModal = ({
  isOpen,
  onClose,
  title,
  description,
  buttonRef,
  type,
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
              <li>복사한 프롬프트를 사용하시는 AI 솔루션에 붙여넣기 합니다.</li>
              <li>
                {type === 'company'
                  ? '기업 별로 학습된 AI 솔루션을 통해 지원서를 작성합니다.'
                  : '채용공고 별로 학습된 AI 솔루션을 통해 지원서를 작성합니다.'}
              </li>
            </ol>
            <div className="mt-4 flex items-start rounded-lg bg-blue-50 p-4">
              <svg
                className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6c0 1.887.87 3.564 2.23 4.686l-.438 3.5a.75.75 0 00.917.81L10 16.25l3.29 1.747a.75.75 0 00.917-.81l-.437-3.5A6.003 6.003 0 0016 8a6 6 0 00-6-6zm0 9a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <p className="text-sm font-medium">
                <span className="font-bold text-blue-500">Tip:</span> 프롬프트를
                사용할 때 자신의 경험과 역량을 구체적으로 입력하면 더 맞춤화된
                결과를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
