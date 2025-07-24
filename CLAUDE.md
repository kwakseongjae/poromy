# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Poromy** is a Korean-language AI-powered career assistance platform that helps job seekers create personalized cover letters using AI prompts. The platform analyzes job postings from 직행 (Jikhaeng) and provides customized prompts for ChatGPT and Claude AI.

## Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript with strict configuration
- **Frontend**: React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL with Row Level Security)
- **State Management**: TanStack React Query v5 for server state, nuqs for URL state
- **Package Manager**: pnpm
- **AI Tool**: Cursor AI with .cursorrules integration

## Development Commands

### Core Commands
```bash
# Development
pnpm dev                    # Start development server

# Building & Production
pnpm build                  # Full production build (includes cursorrules update, sitemap/robots generation)
pnpm build:analyze          # Build with bundle analyzer (ANALYZE=true)
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm format                 # Format code with Prettier
pnpm format:check           # Check Prettier formatting

# Asset Generation
pnpm generate-icons         # Generate React components from SVG files in public/svg/
pnpm generate-company-data  # Generate company data from scripts
pnpm generate:sitemap       # Generate dynamic sitemap.xml
pnpm generate:robots        # Generate robots.txt

# Database Operations
pnpm migrate-jobs           # Migrate jobs to Supabase (batch)
pnpm migrate-job            # Migrate single job to Supabase (--single flag)

# Cursor AI Integration
pnpm cursorrules:update     # Update .cursorrules with current project structure
```

### Testing
⚠️ **No testing framework is currently implemented**. The project has no test files, configuration, or testing dependencies.

## Architecture & Patterns

### Application Structure
```
src/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/            # React components organized by domain
│   ├── admin/            # Admin-specific components
│   ├── analytics/        # Analytics and tracking
│   ├── common/           # Shared utility components
│   ├── home/             # Homepage components
│   ├── navigation/       # Navigation components
│   └── ui/               # Base UI components
├── lib/                  # Core utilities and clients
│   ├── react-query/      # Query configuration and hooks
│   ├── supabase-*.ts     # Database client configurations
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── services/             # Business logic services
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── providers/            # React context providers
```

### Key Architectural Patterns

#### 1. Query Key Management
- Centralized query keys in `src/lib/react-query/query-keys.ts`
- Structured approach: `['poromy', domain, action, ...params]`
- Example: `queryKeys.jobs.detail(id)` → `['poromy', 'jobs', 'detail', id]`

#### 2. Supabase Integration
- **IMPORTANT**: Always use centralized Supabase clients from the `lib` folder
- **Never** import `createClient` directly from `@supabase/supabase-js`
- Multiple client configurations for different contexts:
  - `supabase-client.ts` - Browser client for client-side operations (singleton pattern)
  - `supabase-server.ts` - Server client for SSR and API routes (fresh per request)
  - `supabase-middleware.ts` - Middleware client for route protection
  - `createAdminClient()` - Admin client for operations that bypass RLS

##### Supabase Client Usage Patterns
```typescript
// ✅ Client-side components
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
const supabase = createBrowserSupabaseClient()

// ✅ Server components and API routes (user context)
import { createClient } from '@/lib/supabase-server'
const supabase = await createClient()

// ✅ Admin operations (bypasses RLS)
import { createAdminClient } from '@/lib/supabase-server'
const supabase = createAdminClient()

// ❌ NEVER do this
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(...) // Creates unnecessary instances
```

#### 3. Performance Optimization
- ISR (Incremental Static Regeneration) with 3-minute revalidation
- Multi-layer caching strategy (Server, API, Browser)
- Image proxy API for external company logos
- Bundle optimization with webpack configuration

#### 4. SEO Strategy
- Dynamic sitemap generation from database content
- Korean-first optimization (Naver, Google KR)
- Structured data with JSON-LD schemas
- Meta tag optimization per page

### Important Conventions

#### Component Organization
- **Domain-based grouping**: Components organized by business domain (company, position, inquiry)
- **Shared components**: Common utilities in `components/common/`
- **UI primitives**: Base components in `components/ui/`
- **Barrel exports**: Use index.ts files for clean imports

#### Data Fetching Patterns
```typescript
// Use React Query with centralized keys
const { data, isLoading, error } = useQuery(
  queryKeys.jobs.detail(id),
  () => fetchJobDetail(id)
)
```

#### Form Handling
- React Hook Form + Zod for validation
- Consistent error handling patterns
- Field-level or form-level validation based on requirements

#### Performance Considerations
- Use Server Components for static content and SEO
- Dynamic imports for client-heavy components
- Progressive enhancement approach
- Font optimization with Pretendard (`font-display: optional`)

## Database Schema

### Key Tables
- **jobs**: Job postings with metadata and relationships
- **companies**: Company information and logos
- **profiles**: User profiles linked to Supabase auth
- **inquiries & answers**: Customer support system
- **administrators**: Role-based access control

### Security
- Row Level Security (RLS) policies on all tables
- Authentication middleware protecting routes
- Content Security Policy headers
- Input validation with Zod schemas

## Build System & Scripts

### Build Pipeline
The build process runs in sequence:
1. `cursorrules:update` - Updates .cursorrules with current project structure
2. `generate:sitemap` - Creates dynamic sitemap from database
3. `generate:robots` - Generates robots.txt
4. `next build` - Next.js production build

### Code Generation
- **SVG to React**: `generate-icons` converts SVG files to React components
- **Data Generation**: Scripts in `/scripts` directory for data processing
- **Automatic Structure Updates**: `.cursorrules` updates maintain AI coding consistency

## Special Configurations

### Next.js Configuration
- Bundle analyzer integration (`ANALYZE=true pnpm build`)
- Image optimization with WebP format
- Security headers (CSP, X-Frame-Options, etc.)
- Webpack optimizations for production builds

### Cursor AI Integration
- `.cursorrules` file contains project structure and coding guidelines
- Automatic updates during build process
- Maintains consistent code quality and patterns

### Cache Strategy
- **ISR**: 3-minute revalidation for dynamic content
- **API Routes**: 5-minute cache with stale-while-revalidate
- **Static Assets**: 1-year cache with immutable flag
- **Font Files**: Aggressive caching with cross-origin policy

## Development Guidelines

### Code Quality
- Follow the comprehensive frontend design guidelines in `.cursorrules`
- Use TypeScript with strict configuration
- Implement proper error boundaries and loading states
- Prefer composition over props drilling
- Abstract complex logic into custom hooks

### Performance
- Always optimize images using Next.js Image component
- Use the image proxy API (`/api/image-proxy`) for external images
- Implement proper loading states and error handling
- Monitor bundle size with analyzer

### SEO & Accessibility
- Korean-first content strategy
- Proper semantic HTML structure
- Dynamic meta tags and structured data
- Accessibility compliance (WCAG guidelines)

## Environment Variables

The project uses environment variables for:
- Supabase configuration (URL, anon key, service role key)
- Google Analytics tracking ID
- Email service configuration (Resend)
- Image proxy settings

Refer to Supabase dashboard and deployment configuration for specific values.

## Common Issues

### External Image Handling
- **Problem**: Next.js restrictions on external domains for images
- **Solution**: Use the image proxy API at `/api/image-proxy?url=<encoded_url>`

### Build Performance
- Use `pnpm build:analyze` to identify bundle size issues
- SVG components are auto-generated; don't edit manually
- .cursorrules updates can be skipped in development with custom scripts

### Database Operations
- Always use the appropriate Supabase client for context (client/server/middleware)
- RLS policies require proper user context
- Use React Query for all data fetching with proper error handling