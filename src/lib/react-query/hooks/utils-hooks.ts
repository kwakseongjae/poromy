import { useQuery, useMutation } from '@tanstack/react-query'
import { promptsApi, utilsApi } from '../api-client'
import { queryKeys } from '../query-keys'

/**
 * Utility and miscellaneous React Query hooks
 */

// Get company prompt
export function useCompanyPrompt(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.prompts.company(id).queryKey,
    queryFn: () => promptsApi.getCompanyPrompt(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes - prompts don't change often
  })
}

// Get position prompt
export function usePositionPrompt(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.prompts.position(id).queryKey,
    queryFn: () => promptsApi.getPositionPrompt(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes - prompts don't change often
  })
}

// Get link preview
export function useLinkPreview(url: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.utils.linkPreview(url).queryKey,
    queryFn: () => utilsApi.getLinkPreview(url),
    enabled: enabled && !!url,
    staleTime: 60 * 60 * 1000, // 1 hour - link previews are stable
    retry: 1, // Only retry once for link previews
  })
}

// Send inquiry notification
export function useSendInquiryNotification() {
  return useMutation({
    mutationFn: utilsApi.sendInquiryNotification,
  })
}

// Send answer notification
export function useSendAnswerNotification() {
  return useMutation({
    mutationFn: utilsApi.sendAnswerNotification,
  })
}

// Revalidate path
export function useRevalidate() {
  return useMutation({
    mutationFn: utilsApi.revalidate,
  })
}