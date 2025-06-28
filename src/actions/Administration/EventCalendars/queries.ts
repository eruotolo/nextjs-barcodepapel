'use server';

import prisma from '@/lib/db/db';
import type {
    EventeCalendarInterface,
    EventeCalendarUniqueInterface,
} from '@/types/Administration/EventCalendars/EventeCalendarInterface';
import type { Prisma } from '@prisma/client';

const DATEOTHER_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC', // Force UTC to avoid timezone conversion
});
const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // Force UTC to avoid timezone conversion
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
                venue: true,
                showTime: true,
                price: true,
                linkUrl: true, // Agregando linkUrl que faltaba
                eventCategoryId: true,
                eventCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Mapear y formatear las fechas usando el formateador reutilizable
        return response.map((event) => ({
            ...event,
            date: DATEOTHER_FORMATTER.format(event.date),
            venue: event.venue ?? '',
            showTime: event.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(event.price),
            linkUrl: event.linkUrl ?? '',
            createdAt: DATE_FORMATTER.format(event.createdAt),
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
                venue: true,
                showTime: true,
                audienceType: true,
                price: true,
                linkUrl: true,
                eventCategoryId: true,
                eventCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!response) {
            return null;
        }

        return {
            ...response,
            date: DATEOTHER_FORMATTER.format(response.date),
            venue: response.venue ?? '',
            showTime: response.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(response.price),
            linkUrl: response.linkUrl ?? '',
        };
    } catch (error) {
        console.error(`Error fetching event post with ID ${id}:`, error);
        throw error;
    }
}

export async function getEventByIdForEdit(
    id: string,
): Promise<EventeCalendarUniqueInterface | null> {
    try {
        const response = await prisma.eventeCalendar.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                date: true,
                venue: true,
                showTime: true,
                audienceType: true,
                price: true,
                linkUrl: true,
                eventCategoryId: true,
                eventCategory: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!response) {
            return null;
        }

        return {
            ...response,
            date: response.date.toISOString(), // Return raw date for editing
            venue: response.venue ?? '',
            showTime: response.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(response.price),
            linkUrl: response.linkUrl ?? '',
        };
    } catch (error) {
        console.error(`Error fetching event post with ID ${id}:`, error);
        throw error;
    }
}

export async function getEventMonth(): Promise<EventeCalendarInterface[]> {
    try {
        // Obtener desde hoy hasta los próximos 30 días
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        next30Days.setHours(23, 59, 59, 999); // Incluir todo el día 30

        const response = await prisma.eventeCalendar.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                date: true,
                venue: true,
                showTime: true,
                price: true,
                linkUrl: true, // Nuevo campo
                eventCategoryId: true, // Nuevo campo
                eventCategory: {
                    // Nueva relación
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            where: {
                date: {
                    gte: startOfToday,
                    lte: next30Days,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Mapear y formatear las fechas usando el formateador reutilizable
        return response.map((event) => ({
            ...event,
            date: DATEOTHER_FORMATTER.format(event.date),
            venue: event.venue ?? '',
            showTime: event.showTime ?? 'Sin hora',
            price: PRICE_FORMATTER(event.price),
            linkUrl: event.linkUrl ?? '',
            createdAt: DATE_FORMATTER.format(event.createdAt),
        }));
    } catch (error) {
        console.error('Error fetching events for next 30 days:', error);
        throw error;
    }
}
