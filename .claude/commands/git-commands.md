# Comandos Git Interactivos

Este archivo define comandos Git personalizados para uso con Claude CLI, siguiendo el template personalizado del proyecto.

## 🎯 Uso Rápido
Simplemente escribe: **"git commands"** para ver el menú de opciones disponibles.

## 📋 Menú de Comandos Disponibles

### 1. **Add + Commit**
- Agrega todos los archivos modificados
- Crea commit con template personalizado
- NO hace push (queda local)

### 2. **Add + Commit + Push** 
- Agrega todos los archivos modificados
- Crea commit con template personalizado
- Hace push a la rama principal (main)

### 3. **Quick Deploy**
- Ejecuta build del proyecto
- Formatea código (Prettier + Tailwind)
- Agrega archivos, hace commit y push
- Flujo completo de despliegue

### 4. **Status Check**
- Muestra estado actual del repositorio
- Lista archivos modificados
- Muestra últimos commits
- Información de la rama actual

### 5. **Branch Management**
- Crear nueva rama
- Cambiar de rama
- Ver todas las ramas
- Eliminar ramas

### 6. **Emergency Fix**
- Stash trabajo actual
- Crear rama hotfix
- Aplicar cambios críticos
- Merge rápido a main

## 🔧 Template de Commit Automático

**Formato**: `Task: [descripción] Date: [DD-MM-YYYY] Version: [X.Y]`

### Datos Automáticos:
- **Fecha**: Se genera automáticamente con formato DD-MM-YYYY
- **Versión**: Se auto-incrementa basándose en el último commit
- **Tarea**: El usuario solo proporciona la descripción

### Ejemplo de Flujo:
```
Usuario: "git commands"
Claude: "¿Qué comando quieres ejecutar? (1-6)"
Usuario: "2"
Claude: "¿Qué tarea realizaste?"
Usuario: "Creación de componente Newsletter"
Claude: Ejecuta -> Task: Creación de componente Newsletter Date: 30-06-2025 Version: 2.14
```

## 🚀 Comandos Especiales

### Build + Deploy (Opción 3)
Este comando ejecuta la secuencia completa:
1. `bun run build` - Verifica que el proyecto compile
2. `bun run bun:format-prettier` - Formatea el código
3. `bun run sort-tw` - Ordena clases Tailwind
4. `git add .` - Agrega todos los cambios
5. `git commit` - Con template personalizado
6. `git push origin main` - Sube los cambios

### Version Auto-Increment
El sistema detecta automáticamente la siguiente versión:
- Lee el último commit
- Extrae el número de versión actual
- Incrementa automáticamente (2.10 → 2.11)

### Error Handling
- Si falla el build, NO hace commit
- Si falla el push, mantiene el commit local
- Muestra mensajes claros de éxito/error
- Permite retry en caso de errores temporales

## 📝 Ejemplos de Uso

### Ejemplo 1: Commit Simple
```
Input: "git commands"
Output: Menú de opciones
Input: "1"
Output: "¿Qué tarea realizaste?"
Input: "Fix responsive design en header"
Output: Ejecuta add + commit con versión 2.15
```

### Ejemplo 2: Deploy Completo
```
Input: "git commands"
Output: Menú de opciones  
Input: "3"
Output: "¿Qué tarea realizaste?"
Input: "Implementación completa del sistema de usuarios"
Output: Build → Format → Commit → Push (versión 2.16)
```

### Ejemplo 3: Hotfix de Emergencia
```
Input: "git commands"
Output: Menú de opciones
Input: "6" 
Output: "¿Cuál es el problema crítico?"
Input: "Error en login de usuarios"
Output: Stash → Hotfix branch → Commit → Merge → Push
```

## 🎨 Personalización

### Modificar Template
Para cambiar el formato del commit, edita la línea del template en el código:
```bash
"Task: $task Date: $date Version: $version"
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