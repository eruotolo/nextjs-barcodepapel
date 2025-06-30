# Instrucciones de Formateo: Next.js 15 + React 19

Estas instrucciones definen las convenciones de código para mantener consistencia con Next.js 15 y React 19 en el proyecto.

## 1. ESTRUCTURA DE ARCHIVOS Y NAMING CONVENTIONS

### Naming Conventions

```typescript
// ✅ CORRECTO - PascalCase para componentes
NewBlogModal.tsx;
BlogsTable.tsx;
AdminLayout.tsx;

// ✅ CORRECTO - camelCase para utilities y hooks
usePagePermissions.ts;
blogInterface.ts;
apiHelpers.ts;

// ✅ CORRECTO - kebab-case para pages y routes
blog - details / page.tsx;
user - profile / layout.tsx;

// ❌ INCORRECTO
newblogmodal.tsx;
BlogsTable.js(usar.tsx);
admin_layout.tsx;
```

### Estructura de Directorios

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (admin)/           # Route groups
│   ├── (auth)/
│   ├── (public)/
│   └── api/
├── components/            # Componentes reutilizables
│   ├── ui/               # shadcn/ui components
│   ├── Modal/            # Modales por dominio
│   └── Tables/           # Tablas por dominio
├── actions/              # Server Actions
├── types/                # Interfaces TypeScript
└── lib/                  # Utilities y configuraciones
```

## 2. IMPORT/EXPORT PATTERNS

### Orden de Imports

```typescript
// ✅ CORRECTO - Orden específico
'use client'; // Directiva de cliente (si aplica)

// 1. React y Next.js
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

// 2. Librerías externas (alfabético)
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// 3. Imports internos con alias (alfabético)
import { createPost } from '@/actions/Administration/Blogs';
import BtnSubmit from '@/components/BtnSubmit/BtnSubmit';
import { cn } from '@/lib/utils';

// 4. Tipos al final
import type { BlogInterface } from '@/types/Administration/Blogs/BlogInterface';
import type { NextPage } from 'next';

// ❌ INCORRECTO - Orden mixto
import { toast } from 'sonner';
import React from 'react';
import { createPost } from '@/actions/Administration/Blogs';
```

### Export Patterns

```typescript
// ✅ CORRECTO - Default export para componentes principales
export default function BlogModal() {
  return <div>...</div>;
}

// ✅ CORRECTO - Named exports para utilities
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES').format(date);
};

export { formatDate, parseDate };

// ✅ CORRECTO - Re-exports para índices
export { default as NewBlogModal } from './NewBlogModal';
export { default as EditBlogModal } from './EditBlogModal';
```

## 3. COMPONENTES: SERVER vs CLIENT

### Server Components (por defecto)

```typescript
// ✅ CORRECTO - Server Component (NO usar 'use client')
import { getAllBlogs } from '@/actions/Administration/Blogs/queries';

export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div>
      <h1>Blogs</h1>
      {blogs.map(blog => (
        <article key={blog.id}>
          <h2>{blog.name}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Client Components

```typescript
// ✅ CORRECTO - Client Component
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function InteractiveModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Efectos del lado del cliente
  }, []);

  const handleClick = () => {
    toast.success('Acción completada');
  };

  return (
    <button onClick={handleClick}>
      Abrir Modal
    </button>
  );
}
```

### Cuándo usar 'use client'

```typescript
// ✅ USAR 'use client' cuando:
// - Usas hooks (useState, useEffect, etc.)
// - Manejas eventos (onClick, onChange, etc.)
// - Accedes a APIs del navegador (localStorage, window, etc.)
// - Usas librerías que requieren cliente (react-hook-form, etc.)

// ✅ NO usar 'use client' cuando:
// - Solo renderizas contenido estático
// - Haces fetch de datos en el servidor
// - Usas Server Actions
// - El componente no necesita interactividad
```

## 4. TYPESCRIPT PATTERNS

### Interfaces y Types

```typescript
// ✅ CORRECTO - Interfaces para objetos
export interface BlogInterface {
    id: string;
    name: string;
    content: string;
    author: string;
    publishedAt: Date;
    categories: CategoryInterface[];
}

// ✅ CORRECTO - Types para uniones y primitivos
export type Status = 'draft' | 'published' | 'archived';
export type ID = string | number;

// ✅ CORRECTO - Props interfaces
interface BlogModalProps {
    blog?: BlogInterface;
    isOpen: boolean;
    onClose: () => void;
}

// ✅ CORRECTO - Generics para reutilización
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
}
```

### Anotaciones de Tipos

```typescript
// ✅ CORRECTO - Explicito cuando sea necesario
const [blogs, setBlogs] = useState<BlogInterface[]>([]);
const blogRef = useRef<HTMLDivElement>(null);

// ✅ CORRECTO - Inferencia cuando es clara
const [isOpen, setIsOpen] = useState(false); // boolean inferido
const blogCount = blogs.length; // number inferido

// ✅ CORRECTO - Async functions
async function fetchBlog(id: string): Promise<BlogInterface | null> {
    try {
        const blog = await getBlogById(id);
        return blog;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}
```

## 5. HOOKS Y STATE MANAGEMENT

### useState Patterns

```typescript
// ✅ CORRECTO - Estado primitivo
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ✅ CORRECTO - Estado de objeto
const [formData, setFormData] = useState<BlogFormData>({
    name: '',
    content: '',
    categoryId: '',
});

// ✅ CORRECTO - Función de actualización
const updateFormField = useCallback((field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({
        ...prev,
        [field]: value,
    }));
}, []);
```

### useEffect Patterns

```typescript
// ✅ CORRECTO - Cleanup y dependencies
useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchBlogs();
            if (isMounted) {
                setBlogs(data);
            }
        } catch (error) {
            if (isMounted) {
                setError('Failed to fetch blogs');
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    };

    fetchData();

    return () => {
        isMounted = false;
    };
}, []);

// ❌ INCORRECTO - Sin cleanup
useEffect(() => {
    fetchBlogs().then(setBlogs);
}, []);
```

### Custom Hooks

```typescript
// ✅ CORRECTO - Custom hook reutilizable
function useAsyncData<T>(fetchFn: () => Promise<T>, dependencies: React.DependencyList = []) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchFn();
                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { data, isLoading, error };
}
```

## 6. SERVER ACTIONS Y FORMULARIOS

### Server Actions

```typescript
// ✅ CORRECTO - Server Action
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function createBlog(formData: FormData): Promise<ActionResult> {
    try {
        // Validación de datos
        const name = formData.get('name') as string;
        const content = formData.get('content') as string;

        if (!name || !content) {
            return { success: false, error: 'Missing required fields' };
        }

        // Operación de base de datos
        const blog = await prisma.blog.create({
            data: {
                name,
                content,
                authorId: 'user-id', // Obtener del session
                createdAt: new Date(),
            },
        });

        // Revalidar cache
        revalidatePath('/admin/blogs');

        return { success: true, data: blog };
    } catch (error) {
        console.error('Error creating blog:', error);
        return { success: false, error: 'Failed to create blog' };
    }
}

// ✅ CORRECTO - Tipo para el resultado
interface ActionResult {
    success: boolean;
    data?: any;
    error?: string;
}
```

### Formularios con Server Actions

```typescript
// ✅ CORRECTO - Formulario optimizado
'use client';

import { useActionState } from 'react';
import { createBlog } from '@/actions/blogs';

export default function BlogForm() {
  const [state, formAction, isPending] = useActionState(createBlog, {
    success: false,
    error: null
  });

  return (
    <form action={formAction}>
      <input
        name="name"
        placeholder="Blog title"
        required
        disabled={isPending}
      />
      <textarea
        name="content"
        placeholder="Blog content"
        required
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Blog'}
      </button>
      {state.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  );
}
```

## 7. ESTILOS Y UI PATTERNS

### Tailwind CSS Patterns

```typescript
// ✅ CORRECTO - Clases ordenadas con rustywind
import { cn } from '@/lib/utils';

export default function BlogCard({ className, ...props }) {
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col",
        // Spacing
        "p-4 gap-3",
        // Appearance
        "bg-white rounded-lg shadow-sm",
        // Responsive
        "sm:p-6 md:gap-4",
        // State
        "hover:shadow-md transition-shadow",
        // Custom
        className
      )}
      {...props}
    >
      {/* Contenido */}
    </div>
  );
}
```

### shadcn/ui Components

```typescript
// ✅ CORRECTO - Uso de componentes shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function BlogModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## 8. PERFORMANCE Y OPTIMIZACIONES

### React.memo y useCallback

```typescript
// ✅ CORRECTO - Memoización estratégica
import { memo, useCallback, useMemo } from 'react';

interface BlogItemProps {
  blog: BlogInterface;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BlogItem = memo(function BlogItem({
  blog,
  onEdit,
  onDelete
}: BlogItemProps) {
  const handleEdit = useCallback(() => {
    onEdit(blog.id);
  }, [blog.id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(blog.id);
  }, [blog.id, onDelete]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('es-ES').format(new Date(blog.createdAt));
  }, [blog.createdAt]);

  return (
    <article className="border rounded-lg p-4">
      <h3>{blog.name}</h3>
      <p>{formattedDate}</p>
      <div className="flex gap-2 mt-2">
        <Button onClick={handleEdit}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </article>
  );
});
```

### Lazy Loading y Suspense

```typescript
// ✅ CORRECTO - Lazy loading
import { lazy, Suspense } from 'react';

const BlogEditor = lazy(() => import('@/components/BlogEditor'));

export default function BlogPage() {
  return (
    <div>
      <h1>Blog Management</h1>
      <Suspense fallback={<div>Loading editor...</div>}>
        <BlogEditor />
      </Suspense>
    </div>
  );
}
```

### Next.js Image Optimization

```typescript
// ✅ CORRECTO - Optimización de imágenes
import Image from 'next/image';

export default function BlogCard({ blog }) {
  return (
    <article>
      {blog.image && (
        <Image
          src={blog.image}
          alt={blog.name}
          width={400}
          height={300}
          className="rounded-lg object-cover"
          priority={false} // true solo para above-the-fold
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        />
      )}
      <h3>{blog.name}</h3>
    </article>
  );
}
```

## 9. ERROR HANDLING

### Error Boundaries

```typescript
// ✅ CORRECTO - Error boundary
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class BlogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Blog error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold">
            Something went wrong
          </h2>
          <p className="text-red-600 mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// ✅ CORRECTO - Manejo de errores async
export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setError(null);
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load blogs';
        setError(message);
        console.error('Error loading blogs:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBlogs();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
```

## 10. CORRECCIÓN ORTOGRÁFICA BILINGÜE (ESPAÑOL/INGLÉS)

### Principios de Corrección Bilingüe

**IMPORTANTE**: Este proyecto maneja "Spanglish" intencionalmente donde los clientes mezclan español e inglés. Se debe respetar esta decisión del cliente mientras se corrigen errores ortográficos genuinos.

### ✅ CORRECCIONES PERMITIDAS - Errores Ortográficos Genuinos

#### Español

```typescript
// ✅ CORRECTO - Errores ortográficos en español
"Línea" (no "Linea") - falta tilde
"Cargar más" (no "Cargas más") - verbo incorrecto
"Próximos" (no "Proximos") - falta tilde
"Descripción" (no "Descripcion") - falta tilde
"Configuración" (no "Configuracion") - falta tilde
"Información" (no "Informacion") - falta tilde
"Administración" (no "Administracion") - falta tilde
"Creación" (no "Creacion") - falta tilde
"Edición" (no "Edicion") - falta tilde
"Gestión" (no "Gestion") - falta tilde
"Acción" (no "Accion") - falta tilde
```

#### Inglés

```typescript
// ✅ CORRECTO - Errores ortográficos en inglés
"Description" (no "Descriptiom")
"Administration" (no "Administracion" cuando debe ser inglés)
"Configuration" (no "Configuracion" cuando debe ser inglés)
"Management" (no "Managment")
"Development" (no "Developement")
"Implementation" (no "Implementacion" cuando debe ser inglés)
```

### ❌ NO CORREGIR - Spanglish Intencional del Cliente

```typescript
// ❌ NO CAMBIAR - Son decisiones del cliente
"Home" → NO cambiar a "Inicio"
"Dashboard" → NO cambiar a "Panel"
"Login" → NO cambiar a "Iniciar Sesión"
"Settings" → NO cambiar a "Configuraciones"
"Admin" → NO cambiar a "Administrador"
"Blog" → NO cambiar a "Artículo"
"Team" → NO cambiar a "Equipo"
"Event" → NO cambiar a "Evento"
"News" → NO cambiar a "Noticias"

// Rutas URL - RESPETAR siempre
"/home" → Correcto
"/admin" → Correcto
"/settings" → Correcto
"/noticas" → Mantener (aunque tenga error, es decisión del cliente)
```

### Patrones de Corrección por Contexto

#### 1. Texto de UI/UX (Visible al Usuario)

```typescript
// ✅ CORRECTO - Corregir errores ortográficos
<h1>Próximos Eventos</h1> // (no "Proximos")
<p>Descripción del evento</p> // (no "Descripcion")
<button>Cargar más</button> // (no "Cargas más")

// ❌ NO CAMBIAR - Términos técnicos del cliente
<nav>Home | Dashboard | Settings</nav>
```

#### 2. Código y Variables

```typescript
// ✅ CORRECTO - Nombres técnicos en inglés consistentes
const userConfiguration = {}; // (no userConfiguracion)
const eventDescription = ''; // (no eventDescripcion)

// ❌ NO CAMBIAR - Si el cliente usa Spanglish
const homeSettings = {}; // Cliente decidió "home" en vez de "inicio"
const adminPanel = {}; // Cliente decidió "admin" en vez de "administrador"
```

#### 3. Rutas y URLs

```typescript
// ❌ NUNCA CAMBIAR - Pueden romper la funcionalidad
href = '/noticas'; // Mantener aunque tenga error ortográfico
href = '/admin/configuracion'; // Si existe, mantener
href = '/dashboard/settings'; // Mantener el Spanglish del cliente
```

#### 4. Comentarios en Código

```typescript
// ✅ CORRECTO - Corregir errores en comentarios
// Configuración principal del sistema (no "Configuracion")
// Función para validar información (no "informacion")

// ✅ ACEPTABLE - Spanglish en comentarios técnicos
// Hook para manejar el Home state
// Componente del Admin Dashboard
```

### Herramientas de Verificación

#### Diccionario Español

```typescript
// Palabras comunes con tildes
const spanishWords = {
    accion: 'acción',
    administracion: 'administración',
    configuracion: 'configuración',
    creacion: 'creación',
    descripcion: 'descripción',
    edicion: 'edición',
    gestion: 'gestión',
    informacion: 'información',
    linea: 'línea',
    proximos: 'próximos',
};
```

#### Diccionario Inglés

```typescript
// Errores comunes en inglés
const englishWords = {
    managment: 'management',
    developement: 'development',
    configuracion: 'configuration', // cuando debe ser inglés
    administracion: 'administration', // cuando debe ser inglés
};
```

### Proceso de Corrección

1. **Identificar el contexto**:

    - ¿Es texto visible al usuario?
    - ¿Es código/variable técnica?
    - ¿Es una ruta/URL?
    - ¿Es comentario?

2. **Determinar si es error o decisión**:

    - Error ortográfico genuino → Corregir
    - Spanglish intencional → Mantener
    - Ruta funcional → NUNCA cambiar

3. **Aplicar corrección apropiada**:

    - Tildes faltantes en español
    - Ortografía inglesa correcta
    - Concordancia verbal/nominal

4. **Verificar funcionalidad**:
    - Las rutas siguen funcionando
    - Los imports no se rompen
    - Las referencias se mantienen

### Ejemplos Prácticos

```typescript
// ✅ ANTES (con errores)
export default function HomePage() {
  return (
    <main>
      <h1>Proximos Eventos</h1> {/* Error: falta tilde */}
      <p>Descripcion de eventos</p> {/* Error: falta tilde */}
      <Link href="/noticas">Cargas más</Link> {/* Error: verbo incorrecto, pero URL mantener */}
    </main>
  );
}

// ✅ DESPUÉS (corregido apropiadamente)
export default function HomePage() {
  return (
    <main>
      <h1>Próximos Eventos</h1> {/* ✅ Corregido: tilde añadida */}
      <p>Descripción de eventos</p> {/* ✅ Corregido: tilde añadida */}
      <Link href="/noticas">Cargar más</Link> {/* ✅ Texto corregido, URL mantenida */}
    </main>
  );
}
```

## 11. COMANDOS DE VERIFICACIÓN

### Scripts de Formateo

```bash
# Formatear con Prettier
bun run bun:format-prettier

# Ordenar clases de Tailwind
bun run sort-tw

# Verificar tipos
npx tsc --noEmit

# Lint con Biome
npx biome check .
```

### Checklist de Formateo

- [ ] Imports ordenados correctamente
- [ ] 'use client' solo cuando es necesario
- [ ] TypeScript tipos explícitos donde corresponde
- [ ] Componentes memorizados apropiadamente
- [ ] Error handling implementado
- [ ] Nombres siguiendo convenciones
- [ ] Clases de Tailwind ordenadas
- [ ] Server Actions tipadas correctamente
- [ ] Cleanup en useEffect
- [ ] Accesibilidad básica (alt, labels, etc.)
- [ ] **Ortografía corregida respetando Spanglish del cliente**
- [ ] **URLs y rutas funcionales mantenidas**

---

**Uso de estas instrucciones:**
Aplica estas reglas al formatear cualquier archivo `.tsx`, `.ts`, `.jsx`, o `.js` en el proyecto para mantener consistencia con Next.js 15 y React 19, respetando las decisiones lingüísticas del cliente mientras corriges errores ortográficos genuinos.
