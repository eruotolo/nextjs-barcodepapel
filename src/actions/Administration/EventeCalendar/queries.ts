'use server';

import prisma from '@/lib/db/db';
import type {
    EventeCalendarInterface,
    EventeCalendarUniqueInterface,
} from '@/types/Administration/EventeCalendar/EventeCalendarInterface';
import type { Prisma } from '@prisma/client';

const DATEOTHER_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
});
const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
const PRICE_FORMATTER = (price: Prisma.Decimal | null) =>
    price !== null && !Number.isNaN(price.toNumber()) ? price.toNumber().toFixed(2) : '';

export async function getAllEvents(): Promise<EventeCalendarInterface[]> {
    try {
        const response = await prisma.eventeCalendar.findMany({
            select: {
                id: true,
                name: true,
                date: true,
                showTime: true,
                price: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Mapear y formatear las fechas usando el formateador reutilizable
        return response.map((blog) => ({
            ...blog,
            date: DATEOTHER_FORMATTER.format(blog.date),
            showTime: blog.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(blog.price),
            createdAt: DATE_FORMATTER.format(blog.createdAt),
        }));
    } catch (error) {
        console.error('Error fetching Events', error);
        throw error;
    }
}

export async function getEventById(id: string): Promise<EventeCalendarUniqueInterface | null> {
    try {
        const response = await prisma.eventeCalendar.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                date: true,
                description: true,
                venue: true,
                showTime: true,
                audienceType: true,
                price: true,
            },
        });

        if (!response) {
            return null;
        }

        return {
            ...response,
            date: DATEOTHER_FORMATTER.format(response.date),
            showTime: response.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(response.price),
        };
    } catch (error) {
        console.error(`Error fetching event post with ID ${id}:`, error);
        throw error;
    }
}
