# /commit - Poromy Git Commit Convention

Create standardized git commits following Poromy's enhanced convention.

## Usage
```
/commit [--analyze] [--split]
```

## Options
- `--analyze`: Analyze changes and suggest commit grouping
- `--split`: Automatically split changes into logical commits

## Commit Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types
- **feat**: New feature (새로운 기능)
- **fix**: Bug fix (버그 수정)
- **docs**: Documentation (문서 변경)
- **style**: Code style, formatting (코드 스타일)
- **refactor**: Code refactoring (리팩토링)
- **perf**: Performance improvements (성능 개선)
- **test**: Tests (테스트)
- **chore**: Maintenance tasks (유지보수)
- **deps**: Dependencies (의존성)
- **security**: Security fixes (보안)
- **ci**: CI/CD changes (CI/CD)
- **build**: Build system (빌드)

## Scopes
- **auth**: Authentication (인증)
- **admin**: Admin features (관리자)
- **ui**: UI components (UI 컴포넌트)
- **api**: API routes (API 라우트)
- **db**: Database (데이터베이스)
- **supabase**: Supabase specific
- **query**: React Query
- **hooks**: React Hooks
- **types**: TypeScript types
- **config**: Configuration

## Examples

### Simple feature commit
```
feat(auth): Add OAuth2 login support

- Implement Google OAuth integration
- Add Kakao login provider
- Update authentication flow
```

### Bug fix with issue
```
fix(ui): Resolve mobile menu toggle issue

Menu was not closing after navigation on mobile devices.
Added pathname dependency to useEffect.

Closes #123
```

### Performance improvement
```
perf(supabase): Optimize client instantiation

- Use centralized client creation from lib folder
- Implement singleton pattern for browser client
- Cache admin client for repeated use

Reduces API response time by ~40%
```

### Breaking change
```
feat(api)!: Restructure authentication endpoints

BREAKING CHANGE: Authentication endpoints moved from /api/auth/* to /api/v2/auth/*

Migration guide:
- Update all API calls to use new endpoints
- Update environment variables
```

## Best Practices

1. **Subject line**
   - Use imperative mood ("Add" not "Added")
   - No period at the end
   - Maximum 50 characters

2. **Body**
   - Wrap at 72 characters
   - Explain what and why, not how
   - Use bullet points for multiple items

3. **Footer**
   - Reference issues: "Closes #123"
   - Note breaking changes
   - Add co-authors if applicable

4. **Korean support**
   - Can add Korean explanation after English
   ```
   feat(auth): Add email verification
   
   이메일 인증 기능 추가
   - 인증 메일 발송
   - 인증 링크 처리
   ```

## Commit Grouping Strategy

When using `--split`, changes are grouped by:
1. **Infrastructure**: Build tools, configs, dependencies
2. **Backend**: API routes, database, services
3. **Frontend**: UI components, hooks, pages
4. **Documentation**: Docs, comments, examples
5. **Tests**: Test files, test utilities

Each group becomes a separate commit with appropriate type and scope.