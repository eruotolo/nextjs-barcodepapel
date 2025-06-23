'use server';

import prisma from '@/lib/db/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth';

export async function createTeam(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File | null;

        if (!name) {
            return { error: 'Teams name required' };
        }

        let imageUrl: string | undefined;
        if (imageFile && imageFile.size > 0) {
            const fileExtension = imageFile.name.split('.').pop() || 'jpg';
            const fileName = `teams/${name.replace('@', '-at-')}-${Date.now()}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            imageUrl = blob.url;
        }

        const response = await prisma.teams.create({
            data: {
                name,
                description,
                image: imageUrl,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TEAMS.CREATE,
            entity: AUDIT_ENTITIES.TEAMS,
            entityId: response.id,
            description: `Team "${name}" created`,
            metadata: {
                teamId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/teams');
        return response;
    } catch (error) {
        console.error('Error creating tema', error);
        return { error };
    }
}

export async function deleteTeam(id: string) {
    try {
        if (!id) {
            return { error: 'Team not found' };
        }

        const teamToDelete = await prisma.teams.findUnique({
            where: { id },
        });

        if (!teamToDelete) {
            return { error: 'Team does not exist' };
        }

        const response = await prisma.teams.deleteMany({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.TEAMS.DELETE,
            entity: AUDIT_ENTITIES.TEAMS,
            entityId: id,
            description: `Team "${teamToDelete.name}" deleted`,
            metadata: {
                teamId: id,
                name: teamToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/teams');
        return response;
    } catch (error) {
        console.error('Error delete team', error);
        return { error: 'Error delete team' };
    }
}

export async function updateTeam(id: string, formData: FormData) {
    try {
    } catch (error) {}
}
