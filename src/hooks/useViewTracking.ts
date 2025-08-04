import { useCallback, useRef } from 'react'

// Session storage key for tracking viewed jobs
const VIEWED_JOBS_KEY = 'poromy_viewed_jobs'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

interface ViewedJob {
  id: number
  timestamp: number
}

export function useViewTracking() {
  const trackingInProgress = useRef<Set<number>>(new Set())

  const getViewedJobs = useCallback((): ViewedJob[] => {
    try {
      const stored = sessionStorage.getItem(VIEWED_JOBS_KEY)
      if (!stored) return []
      
      const parsed = JSON.parse(stored) as ViewedJob[]
      const now = Date.now()
      
      // Filter out expired entries (older than session duration)
      const validJobs = parsed.filter(job => now - job.timestamp < SESSION_DURATION)
      
      // Update storage with valid entries only
      if (validJobs.length !== parsed.length) {
        sessionStorage.setItem(VIEWED_JOBS_KEY, JSON.stringify(validJobs))
      }
      
      return validJobs
    } catch (error) {
      console.error('Error reading viewed jobs:', error)
      return []
    }
  }, [])

  const markJobAsViewed = useCallback((jobId: number) => {
    try {
      const viewedJobs = getViewedJobs()
      const newJob: ViewedJob = { id: jobId, timestamp: Date.now() }
      
      // Remove existing entry for this job (if any) and add new one
      const updatedJobs = viewedJobs.filter(job => job.id !== jobId)
      updatedJobs.push(newJob)
      
      sessionStorage.setItem(VIEWED_JOBS_KEY, JSON.stringify(updatedJobs))
    } catch (error) {
      console.error('Error marking job as viewed:', error)
    }
  }, [getViewedJobs])

  const isJobAlreadyViewed = useCallback((jobId: number): boolean => {
    const viewedJobs = getViewedJobs()
    return viewedJobs.some(job => job.id === jobId)
  }, [getViewedJobs])

  const trackView = useCallback(async (jobId: number, force: boolean = false) => {
    try {
      // Prevent duplicate tracking calls for the same job
      if (trackingInProgress.current.has(jobId)) {
        return false
      }

      // Check if job was already viewed in this session (unless forced)
      if (!force && isJobAlreadyViewed(jobId)) {
        return true
      }

      trackingInProgress.current.add(jobId)
      
      const response = await fetch(`/api/jobs/${jobId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to track view:', response.status, errorText)
        return false
      }

      const data = await response.json()
      
      // Mark job as viewed in session storage
      markJobAsViewed(jobId)
      
      return data.success
    } catch (error) {
      console.error('Error tracking view:', error)
      return false
    } finally {
      trackingInProgress.current.delete(jobId)
    }
  }, [isJobAlreadyViewed, markJobAsViewed])

  const clearViewedJobs = useCallback(() => {
    try {
      sessionStorage.removeItem(VIEWED_JOBS_KEY)
    } catch (error) {
      console.error('Error clearing viewed jobs:', error)
    }
  }, [])

  return { 
    trackView, 
    isJobAlreadyViewed,
    clearViewedJobs,
    getViewedJobs
  }
}