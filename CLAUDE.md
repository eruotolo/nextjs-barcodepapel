# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
bun run dev              # Start development server with Turbopack
bun run bun:dev         # Start with Bun runtime
bun run bun:devop       # Clean build and start development
```

### Build and Production
```bash
bun run build           # Production build
bun run bun:build       # Production build with Bun
bun run start           # Start production server
bun run preview         # Build and start production server
```

### Database Operations
```bash
bunx prisma studio                                    # Open Prisma Studio
npx prisma migrate dev --name migration_name         # Create and apply migration
npx prisma migrate deploy                           # Apply migrations in production
bunx prisma db seed                                 # Run database seed
bunx prisma generate                                # Generate Prisma client
```

### Code Quality
```bash
bun run sort-tw                    # Sort Tailwind classes with rustywind
bun run bun:format-prettier        # Format code with Prettier
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions and bcrypt
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand stores
- **Rich Text**: TipTap editor
- **Runtime**: Bun preferred, Node.js supported

### App Router Structure
- `(home)/` - Public website pages
- `(admin)/` - Protected admin panel with role-based access
- `(auth)/` - Authentication flows (login, recovery)
- `api/` - API routes including NextAuth and file uploads

### Server Actions Pattern
All CRUD operations use server actions organized in:
- `src/actions/Administration/` - Content management (Blogs, Events, Teams, etc.)
- `src/actions/Settings/` - User and role management
- Each module: `index.ts`, `queries.ts`, `mutations.ts`

### Component Architecture
- **UI Components**: shadcn/ui design system in `src/components/ui/`
- **Feature Components**: Domain-organized (Administration, Settings, Home)
- **Modal Pattern**: Consistent CRUD modals with edit/create variants
- **Table Components**: TanStack Table with pagination and sorting

### Database Schema
Core entities with role-based access control:
- **Users, Roles, Permissions** - Many-to-many relationships with granular control
- **Content**: Blogs, Categories, Teams, Events, Sponsors, PrintedMaterials
- **System**: Audit logs, ticketing, page-level permissions
- **Relations**: Blog-category many-to-many, event categorization

### State Management (Zustand)
- `authStore.ts` - Authentication state
- `permissionsStore.ts` - User permissions
- `sessionStore.ts` - Session management
- `useUserPermissionStore.ts` - Permission checking

### Authentication & Security
- NextAuth.js with custom credentials provider
- JWT sessions (30-day expiry, 24-hour refresh)
- Comprehensive audit logging
- Middleware-based route protection
- Page-level permission system

## Development Patterns

### File Naming Conventions
- Use plural for collections, singular for items
- TypeScript interfaces end with `Interface.ts`
- Server actions: `queries.ts` for reads, `mutations.ts` for writes

### Component Patterns
- Modal-based CRUD operations
- Consistent error handling with Sonner toasts
- Form validation with react-hook-form
- Server-side data fetching with Next.js server components

### Database Operations
- Always use Prisma transactions for multi-table operations
- Include audit logging for all mutations
- Use proper error handling and validation
- Follow the established query patterns in existing actions

### Testing
No formal testing setup exists - consider adding testing infrastructure for new features.

## Environment Setup
- Requires PostgreSQL database
- Uses Vercel Blob for file storage
- Environment variables for NextAuth, database, and email (Brevo)
- Spanish locale support (es-ES)

## Code Quality
- TypeScript strict mode enabled
- Biome for linting (configured in `biome.json`)
- Path aliases configured (`@/` points to `src/`)
- Tailwind class sorting with rustywind