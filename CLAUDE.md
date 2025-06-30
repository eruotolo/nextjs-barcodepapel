# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma de Comunicación

**IMPORTANTE**: Claude Code DEBE responder SIEMPRE en idioma ESPAÑOL. Todas las comunicaciones, explicaciones, comentarios y respuestas deben ser en español, manteniendo únicamente los términos técnicos en inglés cuando sea necesario (nombres de funciones, variables, etc.).

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

## Git y GitHub Workflow

### Template de Commits Personalizado

#### Formato Estándar

```
Task: [Descripción de la tarea realizada] Date: [DD-MM-YYYY] Version: [X.Y]
```

#### Ejemplos de Commits

```bash
# ✅ Correcto
Task: Creación de componente Carousel para sponsors Date: 30-06-2025 Version: 2.10
Task: Fix responsive design en componente NewsHome Date: 30-06-2025 Version: 2.11
Task: Integración de server actions en Cartelera Date: 30-06-2025 Version: 2.12

# ❌ Evitar
Add carousel component
Fixed bugs
Update code
```

### Comandos Git Esenciales

#### Setup Inicial (Solo primera vez)

```bash
# Configurar usuario global
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Configurar branch por defecto
git config --global init.defaultBranch main

# Configurar editor por defecto
git config --global core.editor "code --wait"
```

#### Workflow Diario

```bash
# Ver estado del repositorio
git status

# Agregar archivos específicos
git add archivo.tsx
git add src/components/

# Agregar todos los cambios
git add .

# Commit con template personalizado
git commit -m "Task: [Descripción] Date: $(date '+%d-%m-%Y') Version: [X.Y]"

# Push al repositorio
git push origin main
```

#### Script de Commit Automatizado

```bash
# Función para commit con template (agregar a ~/.bashrc o ~/.zshrc)
gitcommit() {
    if [ -z "$1" ]; then
        echo "Uso: gitcommit 'descripción de la tarea' [versión]"
        echo "Ejemplo: gitcommit 'Creación de componente Header' 2.13"
        return 1
    fi

    local task="$1"
    local version="${2:-$(date +%s | tail -c 3).0}"  # Auto-versión si no se especifica
    local date=$(date '+%d-%m-%Y')

    git add .
    git commit -m "Task: $task Date: $date Version: $version"
    git push origin main
}

# Uso del script
gitcommit "Actualización de CLAUDE.md con comandos Git" 2.10
```

### Branch Management

#### Crear y Trabajar con Branches

```bash
# Crear nueva branch para feature
git checkout -b feature/nombre-del-feature
git checkout -b hotfix/descripcion-del-fix

# Cambiar entre branches
git checkout main
git checkout feature/nombre-del-feature

# Ver todas las branches
git branch -a

# Eliminar branch local
git branch -d feature/nombre-del-feature

# Eliminar branch remota
git push origin --delete feature/nombre-del-feature
```

#### Merge y Sincronización

```bash
# Actualizar branch principal
git checkout main
git pull origin main

# Merge de feature branch
git checkout main
git merge feature/nombre-del-feature

# Merge con mensaje personalizado
git merge feature/nombre-del-feature -m "Task: Merge feature XYZ Date: $(date '+%d-%m-%Y') Version: 2.15"
```

### GitHub CLI Setup

#### Instalación de GitHub CLI

```bash
# macOS (Homebrew)
brew install gh

# Verificar instalación
gh --version

# Login a GitHub
gh auth login

# Configurar preferencias
gh config set git_protocol https
```

#### Comandos GitHub CLI Útiles

```bash
# Crear repositorio
gh repo create nombre-proyecto --public

# Ver información del repositorio
gh repo view

# Crear Pull Request
gh pr create --title "Task: [Descripción] Date: $(date '+%d-%m-%Y') Version: [X.Y]" --body "Descripción detallada del cambio"

# Ver PRs abiertos
gh pr list

# Mergear PR
gh pr merge --merge --delete-branch

# Crear issue
gh issue create --title "Bug: Descripción del problema" --body "Detalles del issue"

# Ver issues
gh issue list
```

### Scripts Avanzados

#### Build + Commit + Push Automatizado

```bash
# Script completo de despliegue
deploy() {
    if [ -z "$1" ]; then
        echo "Uso: deploy 'descripción de la tarea' [versión]"
        return 1
    fi

    local task="$1"
    local version="${2:-2.$(date +%M)}"
    local date=$(date '+%d-%m-%Y')

    echo "🔨 Ejecutando build..."
    bun run build

    if [ $? -eq 0 ]; then
        echo "✅ Build exitoso"
        echo "📝 Formateando código..."
        bun run bun:format-prettier
        bun run sort-tw

        echo "📦 Creando commit..."
        git add .
        git commit -m "Task: $task Date: $date Version: $version"

        echo "🚀 Subiendo cambios..."
        git push origin main

        echo "✅ Deploy completado - Versión: $version"
    else
        echo "❌ Build falló - Revisa los errores antes de hacer commit"
        return 1
    fi
}

# Uso del script
deploy "Actualización completa del sistema de usuarios" 2.20
```

#### Verificar Cambios Antes de Commit

```bash
# Ver diferencias antes de commit
git diff                    # Cambios no staged
git diff --staged          # Cambios staged
git diff HEAD~1            # Comparar con último commit

# Ver historial de commits
git log --oneline -10      # Últimos 10 commits
git log --graph --oneline  # Vista gráfica del historial
```

### Mejores Prácticas

#### Convenciones de Naming

- **Branches**: `feature/nombre-descriptivo`, `hotfix/descripcion-corta`, `release/version-x.y`
- **Commits**: Siempre usar el template personalizado
- **Versiones**: Incrementar de forma consistente (2.1, 2.2, 2.3...)

#### Workflow Recomendado

1. **Crear branch** para nueva funcionalidad
2. **Desarrollar** y hacer commits frecuentes con el template
3. **Probar** la funcionalidad completamente
4. **Merge** a main con commit descriptivo
5. **Deploy** usando script automatizado
6. **Limpiar** branches innecesarias

#### Manejo de Emergencias

```bash
# Stash para guardar trabajo temporal
git stash push -m "Trabajo en progreso antes de hotfix"
git stash list
git stash pop

# Revertir último commit (mantener cambios)
git reset --soft HEAD~1

# Revertir último commit (descartar cambios)
git reset --hard HEAD~1

# Crear hotfix rápido
git checkout -b hotfix/descripcion-corta
# ... hacer cambios ...
git add .
git commit -m "Task: Hotfix crítico - [descripción] Date: $(date '+%d-%m-%Y') Version: 2.$(date +%H)"
git checkout main
git merge hotfix/descripcion-corta
git push origin main
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

## Arquitectura del Sitio Público

### Estructura de Páginas Públicas

El sitio público está organizado bajo `src/app/(public)/` con las siguientes páginas:

- **Homepage (`/`)** - Página principal con múltiples secciones de contenido
- **Página Somos (`/somos`)** - Información institucional
- **Página Manifiesto (`/manifiesto`)** - Declaración de principios
- **Layout Público** - Estructura común con `DynamicHeader` y `Footer`

### Componentes del Sitio Público

#### Sistema de Header

- **`DynamicHeader`** - Header principal que se adapta según la página
- **`AlterHeader`** - Variante alternativa del header
- **`Header`** - Componente base del header
- **`HeaderMenu`** - Configuración del menú de navegación
- **`HeaderRedes`** - Enlaces a redes sociales

#### Componentes de la Homepage

- **`NewsHome`** - Grid de noticias/blogs para la página principal
- **`Cartelera`** - Calendario de eventos próximos (30 días)
- **`CarouselSponsors`** - Carrusel de patrocinadores/alianzas
- **`Suscribite`** - Formulario de suscripción al newsletter

#### Componentes de Layout

- **`Footer`** - Pie de página con información de contacto y enlaces

### Integración con Server Actions

#### Conexiones Datos-Componentes

- **`NewsHome`** → `getPostFromHome(0, 6)` - Obtiene últimos 6 blogs de `Administration/Blogs/queries`
- **`Cartelera`** → `getEventMonth/getEventMonthLimited` - Obtiene eventos del mes de `Administration/EventCalendars/queries`
- **`CarouselSponsors`** → `getAllSponsorsForCarousel` - Obtiene patrocinadores activos de `Administration/Sponsors/queries`
- **`Suscribite`** → Newsletter actions - Gestiona suscripciones de `Administration/Newsletter/mutations`

#### Patrones de Data Fetching

- **Server Components**: `NewsHome` (fetch en servidor para SEO)
- **Client Components**: `Cartelera`, `CarouselSponsors` (interactividad y estado)
- **Hydration**: Componentes client se cargan después del HTML inicial

### Patrones de Arquitectura Pública

#### Responsive Design

- **Mobile-first approach**: Diseño base para móviles, expansión a desktop
- **Breakpoints**: Uso de clases Tailwind (`md:`, `lg:`) para adaptabilidad
- **Grid Systems**: CSS Grid para layouts de noticias y eventos

#### Optimización de Imágenes

- **Next.js Image**: Componente optimizado para todas las imágenes
- **Priority loading**: Hero images con `priority={true}`
- **Responsive images**: Uso de `fill` y `object-cover` para containers fluidos

#### Manejo de Estados

- **Loading states**: Estados de carga para componentes client
- **Error boundaries**: Manejo de errores en fetching de datos
- **Progressive enhancement**: Funcionalidad básica sin JavaScript, mejoras con hidratación

#### Tipografía y Branding

- **Custom fonts**: BasicSans con variantes (Regular, Bold, Light, etc.)
- **Color system**: Paleta personalizada (`text-azul`, `text-fucsia`, `bg-negro`)
- **Spacing system**: Sistema consistente de espaciado y padding

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

### Codificación de Archivos

**IMPORTANTE**: Todos los archivos deben crearse con codificación **ISO-8859-1** para soportar correctamente los caracteres especiales del español (tildes, eñes, etc.). NUNCA usar UTF-8 ya que causa errores de codificación.

## Corrección Ortográfica Bilingüe (Español/Inglés)

### Principios de Corrección

Este proyecto maneja "Spanglish" intencionalmente donde los clientes mezclan español e inglés. **RESPETAR** estas decisiones del cliente mientras se corrigen errores ortográficos genuinos.

### ✅ CORRECCIONES PERMITIDAS

- **Errores ortográficos en español**: "Línea" (no "Linea"), "Próximos" (no "Proximos"), "Descripción" (no "Descripcion")
- **Errores ortográficos en inglés**: "Description" (no "Descriptiom"), "Management" (no "Managment")
- **Concordancia verbal**: "Cargar más" (no "Cargas más")

### ❌ NO CORREGIR - Spanglish Intencional

- **Términos técnicos del cliente**: "Home" (no cambiar a "Inicio"), "Dashboard", "Admin", "Settings"
- **Rutas URL**: NUNCA cambiar (pueden romper funcionalidad) - `/noticas`, `/admin`, `/settings`
- **Nombres de componentes**: Si el cliente decidió "AdminHome", mantener

### Proceso de Corrección

1. **Identificar contexto**: ¿Es texto de UI, código, URL o comentario?
2. **Determinar tipo**: ¿Error ortográfico genuino o decisión del cliente?
3. **Aplicar corrección apropiada**: Solo errores ortográficos, NO cambios de idioma
4. **Verificar funcionalidad**: Que rutas e imports sigan funcionando

### Ejemplo Práctico

```typescript
// ✅ CORRECTO - Corregir errores ortográficos
<h1>Próximos Eventos</h1> // (no "Proximos")
<Link href="/noticas">Cargar más</Link> // Texto corregido, URL mantenida

// ❌ NO CAMBIAR - Decisiones del cliente
<nav>Home | Dashboard | Settings</nav> // Mantener Spanglish
```

Para más detalles, consultar `next_best_practices.md` sección 10.
