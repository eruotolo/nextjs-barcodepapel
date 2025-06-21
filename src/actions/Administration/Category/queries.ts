'use server';

import prisma from '@/lib/db/db';
import type { CategoryInterface } from '@/types/Administration/Blog/CategoryInterface';

export async function getAllCategories(): Promise<CategoryInterface[]> {
    try {
        const response = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
    }
}

export async function getCategoryById(id: string): Promise<CategoryInterface | null> {
    try {
        const response = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!response) {
            throw new Error(`Category with id ${id} not found`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching category', error);
        throw error;
    }
}
