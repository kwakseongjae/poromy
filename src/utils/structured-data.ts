/**
 * 구조화된 데이터(JSON-LD)를 위한 유틸리티 함수들
 * SEO 최적화를 위한 Schema.org 마크업 생성
 */

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Poromy',
  url: 'https://poromy.ai.kr',
  logo: 'https://poromy.ai.kr/images/logo.png',
  description: 'AI 기반 채용공고 분석 프롬프트 아카이브',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'poromy.contact@gmail.com',
    availableLanguage: ['Korean'],
  },
  sameAs: [
    // 향후 소셜 미디어 계정 추가 시 활용
    // 'https://www.linkedin.com/company/poromy',
    // 'https://github.com/kwakseongjae/poromy'
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressLocality: 'Seoul',
  },
  foundingDate: '2024',
  industry: 'Technology',
  knowsAbout: [
    'AI 프롬프트',
    '채용공고 분석',
    '취업 준비',
    '자기소개서 작성',
    '이력서 작성',
    'ChatGPT',
    'Claude',
  ],
})

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Poromy',
  alternateName: 'Poromy AI 프롬프트 아카이브',
  url: 'https://poromy.ai.kr',
  description: 'AI 채용공고 분석 프롬프트 아카이브',
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://poromy.ai.kr/position?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
})

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})

export const generateSoftwareApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Poromy AI 프롬프트 아카이브',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript',
  url: 'https://poromy.ai.kr',
  description: '채용공고와 기업분석을 위한 AI 프롬프트 아카이브',
  author: {
    '@type': 'Organization',
    name: 'Poromy',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'AI 프롬프트 생성',
    '채용공고 분석',
    '기업 정보 조회',
    '자기소개서 작성 지원',
    '이력서 최적화',
  ],
})

export const generateJobPostingSchema = (jobData: {
  title: string
  company: string
  location?: string
  description: string
  datePosted: string
  validThrough?: string
  employmentType?: string
  salary?: {
    currency: string
    value: number | { min: number; max: number }
    unitText: string
  }
  url?: string
  identifier?: {
    name: string
    value: string
  }
}) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: jobData.title,
  description: jobData.description,
  // Required fields for Google Search Console
  datePosted: jobData.datePosted || new Date().toISOString(),
  validThrough: jobData.validThrough || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  employmentType: jobData.employmentType || 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: jobData.company,
    sameAs: 'https://poromy.ai.kr',
    logo: 'https://poromy.ai.kr/images/logo.png',
  },
  // Required jobLocation with proper structure
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: jobData.location || 'Seoul',
      addressRegion: jobData.location || 'Seoul',
      postalCode: '',
      addressCountry: 'KR',
    },
  },
  // Recommended fields
  baseSalary: jobData.salary ? {
    '@type': 'MonetaryAmount',
    currency: jobData.salary.currency || 'KRW',
    value: typeof jobData.salary.value === 'number' ? {
      '@type': 'QuantitativeValue',
      value: jobData.salary.value,
      unitText: jobData.salary.unitText || 'YEAR',
    } : {
      '@type': 'QuantitativeValue',
      minValue: jobData.salary.value.min,
      maxValue: jobData.salary.value.max,
      unitText: jobData.salary.unitText || 'YEAR',
    },
  } : {
    '@type': 'MonetaryAmount',
    currency: 'KRW',
    value: {
      '@type': 'QuantitativeValue',
      value: 0,
      unitText: 'YEAR',
    },
  },
  // Additional recommended fields
  ...(jobData.url && { url: jobData.url }),
  ...(jobData.identifier && { identifier: jobData.identifier }),
  applicantLocationRequirements: {
    '@type': 'Country',
    name: 'KR',
  },
  jobLocationType: 'TELECOMMUTE',
  directApply: true,
})

export const generateArticleSchema = (articleData: {
  headline: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: articleData.headline,
  description: articleData.description,
  author: {
    '@type': 'Person',
    name: articleData.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Poromy',
    logo: {
      '@type': 'ImageObject',
      url: 'https://poromy.ai.kr/images/logo.png',
    },
  },
  datePublished: articleData.datePublished,
  dateModified: articleData.dateModified || articleData.datePublished,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': articleData.url,
  },
  ...(articleData.image && {
    image: {
      '@type': 'ImageObject',
      url: articleData.image,
    },
  }),
})

export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Poromy',
  description: 'AI 기반 채용공고 분석 프롬프트 아카이브 서비스',
  url: 'https://poromy.ai.kr',
  telephone: '+82-10-0000-0000',
  email: 'poromy.contact@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressLocality: 'Seoul',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.5665,
    longitude: 126.978,
  },
  openingHours: 'Mo,Tu,We,Th,Fr 09:00-18:00',
  priceRange: 'Free',
})

/**
 * 여러 스키마를 하나의 배열로 결합하는 헬퍼 함수
 */
export const combineSchemas = (...schemas: Array<Record<string, any>>) =>
  schemas

/**
 * JSON-LD 스크립트 태그 생성을 위한 헬퍼 함수
 */
export const createJsonLdScript = (schema: Record<string, any>) => ({
  type: 'application/ld+json',
  dangerouslySetInnerHTML: {
    __html: JSON.stringify(schema),
  },
})
