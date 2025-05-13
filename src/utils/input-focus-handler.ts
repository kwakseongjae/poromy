/**
 * iOS Safari에서 input과 textarea 클릭 시 자동 확대를 방지하는 핸들러
 */

const preventZoomOnFocus = () => {
  // 모든 input과 textarea 요소 선택
  const inputs = document.querySelectorAll('input, textarea')

  // 각 요소에 이벤트 리스너 추가
  inputs.forEach((input) => {
    // 포커스 시 확대 방지
    input.addEventListener('focus', () => {
      // 현재 viewport scale 저장
      const currentScale = window.visualViewport?.scale || 1

      // viewport meta 태그 찾기
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        // 현재 scale로 viewport 설정
        viewport.setAttribute(
          'content',
          `width=device-width, initial-scale=${1 / currentScale}, maximum-scale=${1 / currentScale}, user-scalable=0`
        )
      }
    })

    // 포커스 해제 시 원래 상태로 복구
    input.addEventListener('blur', () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        )
      }
    })
  })
}

// DOM이 로드된 후 실행
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', preventZoomOnFocus)
}

export default preventZoomOnFocus
