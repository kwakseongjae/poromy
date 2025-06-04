import { createJsonLdScript } from '@/utils/structured-data'

interface StructuredDataProps {
  schema: Record<string, any> | Array<Record<string, any>>
}

/**
 * 페이지별 구조화된 데이터를 추가하기 위한 컴포넌트
 * 개별 페이지에서 특정 스키마를 추가할 때 사용
 */
const StructuredData: React.FC<StructuredDataProps> = ({ schema }) => {
  // 스키마가 배열인 경우 각각을 개별 스크립트로 생성
  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((singleSchema, index) => (
          <script key={index} {...createJsonLdScript(singleSchema)} />
        ))}
      </>
    )
  }

  // 단일 스키마인 경우
  return <script {...createJsonLdScript(schema)} />
}

export default StructuredData
