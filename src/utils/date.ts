/**
 * Formats a date string into a Korean date and time format.
 *
 * Example:
 *   Input:  '2024-06-01T13:05:00Z'
 *   Output: '2024년 6월 1일 22시 05분' (KST, depending on local time)
 *
 * @param dateString - The date string to format (ISO 8601 or similar)
 * @returns Formatted string in 'YYYY년 M월 D일 HH시 mm분' format
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // 시간이 0~9인 경우 앞에 0을 붙임
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${year}년 ${month}월 ${day}일 ${formattedHours}시 ${formattedMinutes}분`
}
