import { ExclamationIcon } from '@/assets'

interface NotificationMessageProps {
  message: string
  icon?: React.ReactNode
  className?: string
}

export const NotificationMessage = ({
  message,
  icon = <ExclamationIcon className="h-5 w-5" />,
  className = '',
}: NotificationMessageProps) => {
  return (
    <div className={`text-text-disabled flex items-center gap-2 ${className}`}>
      {icon}
      <p>{message}</p>
    </div>
  )
}
