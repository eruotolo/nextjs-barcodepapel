# Git Workflow - Implementación de Comandos

Este archivo contiene la lógica de implementación para los comandos Git interactivos.

## 🎯 Comando Principal: "git commands"

Cuando el usuario escriba "git commands", mostrar este menú:

```
🔧 COMANDOS GIT DISPONIBLES:

1. 📁 Add + Commit
   └─ Agregar archivos y hacer commit (local)

2. 🚀 Add + Commit + Push
   └─ Flujo completo: agregar, commit y subir

3. ⚡ Quick Deploy
   └─ Build + Format + Commit + Push

4. 📊 Status Check
   └─ Ver estado actual del repositorio

5. 🌿 Branch Management
   └─ Crear, cambiar o eliminar branches

6. 🚨 Emergency Fix
   └─ Hotfix rápido para problemas críticos

Elige una opción (1-6):
```

## 📋 Implementación de Cada Comando

### Comando 1: Add + Commit

```bash
# Verificar si hay cambios
git status --porcelain

# Si hay cambios:
git add .
git commit -m "Task: [DESCRIPCIÓN_USUARIO] Date: [FECHA_AUTO] Version: [VERSION_AUTO]"

# Confirmación
echo "✅ Commit creado exitosamente - Version: [VERSION]"
```

### Comando 2: Add + Commit + Push

```bash
# Verificar cambios
git status --porcelain

# Si hay cambios:
git add .
git commit -m "Task: [DESCRIPCIÓN_USUARIO] Date: [FECHA_AUTO] Version: [VERSION_AUTO]"
git push origin main

# Confirmación
echo "✅ Cambios subidos exitosamente - Version: [VERSION]"
```

### Comando 3: Quick Deploy

```bash
# Secuencia completa
echo "🔨 Ejecutando build..."
bun run build

# Si build exitoso:
echo "📝 Formateando código..."
bun run bun:format-prettier
bun run sort-tw

echo "📦 Creando commit..."
git add .
git commit -m "Task: [DESCRIPCIÓN_USUARIO] Date: [FECHA_AUTO] Version: [VERSION_AUTO]"

echo "🚀 Subiendo cambios..."
git push origin main

echo "✅ Deploy completado - Version: [VERSION]"
```

### Comando 4: Status Check

```bash
# Información del repositorio
echo "📊 ESTADO DEL REPOSITORIO:"
echo "------------------------"

# Rama actual
echo "🌿 Rama actual: $(git branch --show-current)"

# Archivos modificados
echo "📁 Archivos modificados:"
git status --porcelain

# Últimos 5 commits
echo "📜 Últimos commits:"
git log --oneline -5

# Estado del remoto
echo "🔄 Estado del remoto:"
git fetch origin
git status -b --porcelain
```

### Comando 5: Branch Management

```bash
# Submenú de branches
echo "🌿 GESTIÓN DE BRANCHES:"
echo "1. Crear nueva branch"
echo "2. Cambiar a branch existente"
echo "3. Ver todas las branches"
echo "4. Eliminar branch"

# Según elección del usuario...
```

### Comando 6: Emergency Fix

```bash
# Hotfix de emergencia
echo "🚨 HOTFIX DE EMERGENCIA"

# Stash trabajo actual
git stash push -m "Stash antes de hotfix - $(date)"

# Crear branch hotfix
git checkout -b hotfix/[DESCRIPCIÓN_CORTA]

# Después de hacer cambios:
git add .
git commit -m "Task: Hotfix - [DESCRIPCIÓN_USUARIO] Date: [FECHA_AUTO] Version: [VERSION_AUTO]"

# Merge a main
git checkout main
git merge hotfix/[DESCRIPCIÓN_CORTA]
git push origin main

# Limpiar
git branch -d hotfix/[DESCRIPCIÓN_CORTA]
```

## 🔧 Funciones Auxiliares

### Auto-Fecha

```bash
# Generar fecha automática
DATE=$(date '+%d-%m-%Y')
```

### Auto-Versión

```bash
# Extraer última versión del commit más reciente
LAST_COMMIT=$(git log -1 --pretty=format:"%s")
LAST_VERSION=$(echo "$LAST_COMMIT" | grep -o "Version: [0-9]*\.[0-9]*" | cut -d' ' -f2)

# Incrementar versión
if [[ $LAST_VERSION =~ ^([0-9]+)\.([0-9]+)$ ]]; then
    MAJOR=${BASH_REMATCH[1]}
    MINOR=${BASH_REMATCH[2]}
    NEW_VERSION="$MAJOR.$((MINOR + 1))"
else
    NEW_VERSION="2.1"  # Versión por defecto
fi
```

### Verificar Cambios

```bash
# Verificar si hay archivos para commit
CHANGES=$(git status --porcelain)
if [ -z "$CHANGES" ]; then
    echo "❌ No hay cambios para hacer commit"
    exit 1
fi
```

### Manejo de Errores

```bash
# Verificar éxito del comando anterior
if [ $? -ne 0 ]; then
    echo "❌ Error: [DESCRIPCIÓN_ERROR]"
    echo "🔄 ¿Quieres intentar de nuevo? (y/n)"
    # Lógica de retry...
fi
```

## 🎨 Variables de Plantilla

### Reemplazos Automáticos:

- `[DESCRIPCIÓN_USUARIO]` → Input del usuario
- `[FECHA_AUTO]` → Fecha actual en formato DD-MM-YYYY
- `[VERSION_AUTO]` → Versión auto-incrementada
- `[DESCRIPCIÓN_CORTA]` → Versión corta para nombres de branch

### Ejemplo de Sustitución:

```
Input: "Creación de componente Header responsive"
Output: "Task: Creación de componente Header responsive Date: 30-06-2025 Version: 2.14"
```

## 🚀 Flujo de Interacción

### Ejemplo Completo:

```
1. Usuario: "git commands"
2. Claude: [Muestra menú 1-6]
3. Usuario: "2"
4. Claude: "¿Qué tarea realizaste?"
5. Usuario: "Fix responsive design en navegación"
6. Claude: [Ejecuta comando 2 con template]
7. Claude: "✅ Commit y push exitosos - Version: 2.15"
```

### Validaciones:

- ✅ Verificar que hay cambios antes de commit
- ✅ Verificar que el build pasa antes de push
- ✅ Confirmar antes de ejecutar comandos destructivos
- ✅ Mostrar preview del commit antes de ejecutar

---

**Nota**: Este archivo es solo para documentación. La implementación real se maneja directamente en Claude CLI.
