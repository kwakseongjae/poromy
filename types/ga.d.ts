interface Window {
  gtag: (
    command: 'config' | 'event' | 'consent',
    targetId: string,
    config?: {
      page_path?: string
      page_title?: string
      page_location?: string
      [key: string]: any
    }
  ) => void
}

declare const gtag: Window['gtag']
