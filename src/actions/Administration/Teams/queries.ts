'use server';

import prisma from '@/lib/db/db';
import type { TeamsInterface } from '@/types/Administration/Teams/TeamsInterface';
import { BubbledError } from 'next/dist/server/lib/trace/tracer';

export async function getAllTeams(): Promise<TeamsInterface[]> {
    try {
        const response = await prisma.teams.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return response;
    } catch (error) {
        console.error('Error fetching teams', error);
        throw error;
    }
}

export async function getTeamById(id: string): Promise<TeamsInterface | null> {
    try {
        const response = await prisma.teams.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
            },
        });

        if (!response) {
            throw new Error(`Error fetching Teams with id ${id} not found`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching team by ID', error);
        throw error;
    }
}
