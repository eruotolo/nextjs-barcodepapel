'use server';

import prisma from '@/lib/db/db';
import type { CategoryInterface } from '@/types/Administration/Blogs/CategoryInterface';

export async function getAllCategories(): Promise<CategoryInterface[]> {
    try {
        return await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
    }
}

export async function getCategoryById(id: string): Promise<CategoryInterface | null> {
    try {
        return await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });
    } catch (error) {
        console.error('Error fetching category', error);
        throw error;
    }
}
