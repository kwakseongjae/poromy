import { InquiryProcessModal } from '@/components/inquiry/InquiryProcessModal'

interface NotificationMessageProps {
  message: string
  className?: string
}

export const NotificationMessage = ({
  message,
  className = '',
}: NotificationMessageProps) => {
  return (
    <div className={`text-text-disabled flex items-start gap-2 ${className}`}>
      <InquiryProcessModal />
      <p className="whitespace-pre-line">{message}</p>
    </div>
  )
}
