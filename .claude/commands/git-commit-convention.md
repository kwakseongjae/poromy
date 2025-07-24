# Git Commit Convention Command

## Usage
```bash
/git:commit [type] [scope] [message] [--breaking] [--issue <number>]
```

## Commit Types
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **refactor**: 코드 리팩토링 (기능 변경 없음)
- **perf**: 성능 개선
- **test**: 테스트 추가 또는 수정
- **chore**: 빌드 프로세스, 도구 설정 등
- **deps**: 의존성 업데이트
- **security**: 보안 이슈 수정
- **revert**: 이전 커밋 되돌리기
- **ci**: CI/CD 설정 변경
- **build**: 빌드 시스템 또는 외부 의존성 변경

## Scope Examples
- **auth**: 인증 관련
- **admin**: 관리자 기능
- **ui**: UI 컴포넌트
- **api**: API 라우트
- **db**: 데이터베이스
- **deps**: 의존성
- **config**: 설정 파일
- **supabase**: Supabase 관련
- **query**: React Query 관련
- **types**: TypeScript 타입
- **hooks**: React Hooks
- **utils**: 유틸리티 함수

## Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Examples
```
feat(auth): Add email verification flow

- Implement email verification endpoint
- Add verification email template
- Update user profile after verification

Closes #123
```

```
fix(ui): Resolve mobile navigation toggle issue

The mobile menu was not closing after route change.
Added useEffect to close menu on pathname change.
```

```
perf(api): Optimize Supabase client instantiation

- Use centralized client creation
- Implement singleton pattern for browser client
- Cache admin client instance

Improves API response time by 40%
```

## Flags
- `--breaking`: Add BREAKING CHANGE note
- `--issue <number>`: Link to issue number
- `--no-verify`: Skip pre-commit hooks

## Korean Support
커밋 메시지에 한글 설명을 추가하려면:
```
feat(auth): Add SSO login support

SSO 로그인 기능 추가
- Google OAuth 연동
- Kakao OAuth 연동
- 자동 회원가입 프로세스
```