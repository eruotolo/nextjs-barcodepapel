# 📦 Proyecto Next.js BarcodePapel

Este proyecto utiliza Next.js, Prisma, TailwindCSS y otras librerías modernas. Aquí tienes los comandos más útiles para
el desarrollo y mantenimiento del proyecto.

## 🚀 Comandos de desarrollo

### Iniciar el servidor de desarrollo

```
bun run dev
```

### Compilar el proyecto para producción

```
bun run build
```

### Iniciar el servidor en modo producción

```
bun run start
```

### Limpiar la carpeta de compilación

```
bun run clean
```

### Ordenar clases Tailwind en los archivos

```
bun run sort-tw
```

## 🟣 Prisma (ORM)

### Inicializar Prisma

```
npx prisma init --datasource-provider postgresql
```

### Crear una migración

```
npx prisma migrate dev --name nombre_de_tu_migracion
```

### Aplicar migraciones en producción

```
npx prisma migrate deploy
```

### Abrir Prisma Studio (panel visual de la base de datos)

```
bunx prisma studio
```

### Ejecutar el seed (semilla de datos)

```
bunx prisma db seed
```

## 🧑‍💻 Otros comandos útiles

### Formatear el código con Prettier

```
bun run bun:format-prettier
```

### Instalar dependencias

```
bun install
```

### Actualizar dependencias

```
bun update
```

## AUMENTAR BUFFER DE GIT CONFIG

````
git config http.postBuffer 524288000
````

## 📝 Notas

- Puedes usar los comandos con `bun` si tienes Bun instalado, por ejemplo: `bun run dev`.
- El archivo de configuración de Prisma está en `prisma/schema.prisma`.
- El seed de la base de datos está en `prisma/seed.js`.

---

Para más información, consulta la documentación oficial de cada herramienta:

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
