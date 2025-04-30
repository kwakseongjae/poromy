'use client'

import { useState, useRef } from 'react'
import { CopyIcon, HelpIcon } from '@/assets'
import { HelpModal } from './HelpModal'

interface PromptContainerProps {
  title: string
  description: string
  prompt: string
  type: 'company' | 'position'
}

const PromptContainer = ({
  title,
  description,
  prompt,
  type,
}: PromptContainerProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const helpButtonRef = useRef<HTMLButtonElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const containerClasses =
    type === 'position'
      ? 'rounded-lg border border-gray-200 bg-gray-50 p-4'
      : 'rounded-lg'

  const promptContainerClasses =
    type === 'position'
      ? 'rounded-lg border border-gray-200 bg-white px-4 py-6'
      : 'rounded-lg border border-gray-200 bg-gray-50 px-4 py-6'

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          ref={helpButtonRef}
          onClick={() => setIsHelpModalOpen(true)}
          className="flex cursor-pointer items-center rounded-full p-1"
          aria-label="도움말 확인"
        >
          <HelpIcon className="h-5 w-5" />
          <span className="ml-1 hidden text-sm font-medium text-gray-500 hover:underline sm:block">
            프롬프트는 어떻게 적용하나요?
          </span>
        </button>
      </div>
      <p className="my-2 text-sm whitespace-pre-wrap text-gray-600">
        {description}
      </p>

      <div className="relative">
        <div className={promptContainerClasses}>
          <button
            onClick={handleCopy}
            className="bg-primary hover:bg-primary-hover absolute top-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white opacity-80 transition-colors hover:opacity-100"
            aria-label="Copy prompt"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
          >
            <CopyIcon className="h-4 w-4" />
            <span>{isCopied ? '복사 완료!' : 'Copy'}</span>
          </button>
          <pre className="text-sm whitespace-pre-wrap text-gray-700">
            {prompt}
          </pre>
        </div>
        {isCopied && (
          <div className="bg-success absolute -top-10 right-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white">
            복사 완료!
          </div>
        )}
      </div>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="프롬프트 적용 방법"
        description="AI 프롬프트를 적용하여 지원서를 작성하는 방법을 안내해드립니다."
        buttonRef={helpButtonRef}
      />
    </div>
  )
}

export default PromptContainer
