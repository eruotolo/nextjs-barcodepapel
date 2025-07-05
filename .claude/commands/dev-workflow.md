# Workflow de Desarrollo Interactivo

Este archivo define comandos de desarrollo completos para uso con Claude CLI, incluyendo formateo, build, Git y más.

## 🎯 Uso Rápido

Simplemente escribe: **"dev workflow"** para ver el menú de opciones disponibles.

## 📋 Menú de Comandos de Desarrollo Disponibles

### 1. **Format + Add + Commit**

- Aplica **next_best_practices** SOLO a archivos en staging
- Formateo Next.js 15 + React 19 + corrección ortográfica bilingüe
- Agrega todos los cambios (nuevos, modificados, eliminados)
- Crea commit con template personalizado
- Queda listo para push manual

### 2. **Format + Add + Commit + Push**

- Aplica **next_best_practices** SOLO a archivos en staging
- Formateo Next.js 15 + React 19 + corrección ortográfica bilingüe
- Agrega todos los cambios (nuevos, modificados, eliminados)
- Crea commit con template personalizado
- Push automático a GitHub
- Flujo completo automatizado

### 3. **Quick Format (Solo Git Staged)**

- Aplica formateo según **next_best_practices** SOLO a archivos en staging
- Prettier + TypeScript + Biome lint + corrección ortográfica
- Perfecto antes de revisar cambios específicos

### 4. **Format Full Project**

- Aplica **next_best_practices** a TODO el proyecto
- Formateo completo Next.js 15 + React 19 + corrección ortográfica bilingüe
- Perfecto para mantener consistencia global
- Sin commit (solo formateo)

### 5. **Build + Format + Commit**

- Ejecuta build del proyecto con verificación de tipos
- Aplica **next_best_practices** SOLO a archivos en staging
- Formateo Next.js 15 + React 19 + corrección ortográfica bilingüe
- Agrega todos los cambios y hace commit
- Listo para push manual

### 6. **Add + Commit + Push**

- Solo agrega archivos, hace commit y push
- Sin formateo ni build
- Para commits rápidos con push automático

### 7. **Simple Commit**

- Solo agrega archivos y hace commit
- Sin formateo ni build
- Para commits rápidos (sin push)

### 8. **Status Check**

- Muestra estado actual del repositorio local
- Lista archivos modificados
- Muestra últimos commits
- Información de la rama actual
- Sin verificación remota (push manual)

### 9. **Stash Management**

- Guardar trabajo temporal
- Aplicar stash guardado
- Listar stashes disponibles

## 🔧 Template de Commit Automático

**Formato**: `Task: [descripción] | Date: [DD-MM-YYYY] | Version: [X.Y]`

### Datos Automáticos:

- **Fecha**: Se genera automáticamente con formato DD-MM-YYYY
- **Versión**: Se auto-incrementa basándose en el último commit
- **Tarea**: El usuario solo proporciona la descripción

### Ejemplo de Flujo:

```
Usuario: "dev workflow"
Claude: "¿Qué comando de desarrollo quieres ejecutar? (1-9)"
Usuario: "1"
Claude: "¿Qué tarea realizaste?"
Usuario: "Creación de componente Newsletter"
Claude: Ejecuta -> Format + Add + Commit (listo para push manual)
```

## 🚀 Comandos Especiales

### Format + Add + Commit (Opción 1)

Este comando ejecuta la secuencia usando **next_best_practices** SOLO en archivos staged:

1. `git add -A` - Agrega todos los cambios (nuevos, modificados, eliminados)
2. **Formateo selectivo** - Aplica next_best_practices solo a archivos en staging
3. **Corrección ortográfica bilingüe** - Corrige errores respetando Spanglish del cliente
4. `git commit` - Con template personalizado
5. ✅ **Listo para `git push` manual**

### Format + Add + Commit + Push (Opción 2)

Este comando ejecuta la secuencia completa usando **next_best_practices** SOLO en archivos staged:

1. `git add -A` - Agrega todos los cambios (nuevos, modificados, eliminados)
2. **Formateo selectivo** - Aplica next_best_practices solo a archivos en staging
3. **Corrección ortográfica bilingüe** - Corrige errores respetando Spanglish del cliente
4. `git commit` - Con template personalizado
5. `git push origin main` - Push automático a GitHub
6. ✅ **Flujo completo automatizado**

### Quick Format (Opción 3)

Solo formateo de archivos en staging usando **next_best_practices**:

1. **Formateo selectivo** - Solo archivos en Git staging area
2. **Corrección ortográfica bilingüe** - Aplica reglas de next_best_practices
3. ✅ **Sin commit** - Solo formateo para revisar cambios

### Format Full Project (Opción 4)

Formateo completo del proyecto usando **next_best_practices**:

1. `bun run bun:format-prettier` - Aplica formateo Prettier a TODO el proyecto
2. `npx tsc --noEmit` - Verificación de tipos TypeScript
3. `npx biome check .` - Lint completo del proyecto
4. **Corrección ortográfica bilingüe** - Aplica reglas a TODO el proyecto
5. ✅ **Sin commit** - Solo formateo global

### Build + Format + Commit (Opción 5)

Secuencia con verificación completa usando **next_best_practices** en staged files:

1. `rm -rf .next` - Limpia build anterior
2. `bun run build` - Build limpio desde cero
3. `npx tsc --noEmit` - Verificación de tipos TypeScript
4. `git add -A` - Agrega todos los cambios
5. **Formateo selectivo** - Aplica next_best_practices solo a archivos staged
6. **Corrección ortográfica bilingüe** - Aplica reglas de next_best_practices
7. `git commit` - Con template personalizado
8. ✅ **Listo para `git push` manual**

### Add + Commit + Push (Opción 6)

Comando rápido sin formateo ni verificaciones:

1. `git add -A` - Agrega todos los cambios (nuevos, modificados, eliminados)
2. `git commit` - Con template personalizado
3. `git push origin main` - Push automático a GitHub
4. ✅ **Flujo básico completado**

### Version Auto-Increment

El sistema detecta automáticamente la siguiente versión:

- Lee el último commit
- Extrae el número de versión actual
- Incrementa automáticamente (2.10 → 2.11)

### Error Handling

- Si falla el build, NO hace commit
- Si falla el formateo, muestra el error y para
- Muestra mensajes claros de éxito/error
- Permite retry en caso de errores temporales

## 📝 Ejemplos de Uso

### Ejemplo 1: Format + Commit

```
Input: "dev workflow"
Output: Menú de desarrollo
Input: "1"
Output: "¿Qué tarea realizaste?"
Input: "Fix responsive design en header"
Output: Format → Add → Commit (versión 2.15) → ✅ Listo para push manual
Commit: "Task: Fix responsive design en header | Date: 01-07-2025 | Version: 2.15"
```

### Ejemplo 2: Format + Commit + Push

```
Input: "dev workflow"
Output: Menú de desarrollo
Input: "2"
Output: "¿Qué tarea realizaste?"
Input: "Actualización de estilos responsive"
Output: Format → Add → Commit → Push (versión 2.15) → ✅ Completado automáticamente
Commit: "Task: Actualización de estilos responsive | Date: 01-07-2025 | Version: 2.15"
```

### Ejemplo 3: Solo Formateo

```
Input: "dev workflow"
Output: Menú de desarrollo
Input: "3"
Output: Formatea código sin commit → ✅ Listo para revisar cambios
```

### Ejemplo 4: Build + Format + Commit

```
Input: "dev workflow"
Output: Menú de desarrollo
Input: "5"
Output: "¿Qué tarea realizaste?"
Input: "Implementación completa del sistema de usuarios"
Output: Clean → Build → Format → Add → Commit (versión 2.16) → ✅ Listo para push manual
Commit: "Task: Implementación completa del sistema de usuarios | Date: 01-07-2025 | Version: 2.16"
```

### Ejemplo 5: Add + Commit + Push (Nuevo)

```
Input: "dev workflow"
Output: Menú de desarrollo
Input: "6"
Output: "¿Qué tarea realizaste?"
Input: "Corrección rápida de typos"
Output: Add → Commit → Push (versión 2.17) → ✅ Completado automáticamente
Commit: "Task: Corrección rápida de typos | Date: 01-07-2025 | Version: 2.17"
```

## 🎨 Personalización

### Modificar Template

Para cambiar el formato del commit, edita la línea del template en el código:

```bash
"Task: $task | Date: $date | Version: $version"
```

### Agregar Comandos

Para agregar nuevos comandos al menú:

1. Agrega la opción al menú (numerado)
2. Implementa la lógica correspondiente
3. Actualiza esta documentación

### Cambiar Versioning

Actualmente usa formato X.Y (2.10, 2.11...). Para cambiar:

- Modifica la lógica de auto-incremento
- Ajusta el patrón de extracción de versión

## 🔍 Troubleshooting

### Problemas Comunes:

- **"No hay cambios para commit"**: Verificar `git status` primero
- **"Falla el build"**: Revisar errores antes de commit
- **"Conflicto en push"**: Hacer `git pull` primero
- **"Versión incorrecta"**: Verificar formato del último commit

### Debug Mode:

Para ver más detalles de la ejecución, incluir `--verbose` en cualquier comando.

---

**Nota**: Este sistema está diseñado para trabajar exclusivamente con Claude CLI y mantener consistencia en el formato de commits del proyecto.
