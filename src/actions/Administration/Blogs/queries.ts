'use server';

import prisma from '@/lib/db/db';
import type {
    BlogInterface,
    BlogUniqueInterface,
} from '@/types/Administration/Blogs/BlogInterface';

// Crear el formateador de fechas como constante para reutilización
const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export async function getAllPost(): Promise<BlogInterface[]> {
    try {
        const response = await prisma.blog.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                author: true,
                primaryCategoryId: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                BlogCategory: {
                    select: {
                        id: true,
                        blogId: true,
                        categoryId: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Mapear y formatear las fechas usando el formateador reutilizable
        return response.map((blog) => ({
            ...blog,
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        }));
    } catch (error) {
        console.error('Error fetching blog', error);
        throw error;
    }
}

export async function getPostById(id: string): Promise<BlogUniqueInterface | null> {
    try {
        return await prisma.blog.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                primaryCategoryId: true,
                author: true,
                description: true,
                primaryCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error(`Error fetching blog post with ID ${id}:`, error);
        throw error;
    }
}
