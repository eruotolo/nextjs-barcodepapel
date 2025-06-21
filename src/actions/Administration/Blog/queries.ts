'use server';

import prisma from '@/lib/db/db';
import type { BlogInterface, BlogUniqueInterface } from '@/types/Administration/Blog/BlogInterface';

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

        // Crear una única instancia del formateador de fechas
        const dateFormatter = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        // Mapear y formatear las fechas
        return response.map((blog) => ({
            ...blog,
            createdAt: dateFormatter.format(
                blog.createdAt instanceof Date ? blog.createdAt : new Date(blog.createdAt),
            ),
        }));
    } catch (error) {
        console.error('Error fetching blog', error);
        throw error;
    }
}

export async function getPostById(id: string): Promise<BlogUniqueInterface | null> {
    try {
        const response = await prisma.blog.findUnique({
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

        if (!response) {
            throw new Error(`Error fetching blog with id ${id} not found`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching blog by ID', error);
        throw error;
    }
}
