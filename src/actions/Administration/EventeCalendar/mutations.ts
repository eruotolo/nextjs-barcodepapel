'use server';

import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';
import { revalidatePath } from 'next/cache';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth';

export async function createEvent(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const date = formData.get('date') as string;
        const description = formData.get('description') as string | null;
        const venue = formData.get('venue') as string | null;
        const showTime = formData.get('showTime') as string | null;
        const audienceType = formData.get('audienceType') as string | null;
        const price = formData.get('price') as string | null;

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'teams',
                    prefix: 'team-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.eventeCalendar.create({
            data: {
                name,
                image: imageUrl,
                date,
                description,
                venue,
                showTime,
                audienceType,
                price,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.CREATE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: response.id,
            description: `Event "${name}" created`,
            metadata: {
                eventId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');
        return response;
    } catch (error) {
        console.error('Error creating event', error);
        throw error;
    }
}

export async function deleteEvent(id: string) {
    try {
        if (!id) {
            return { error: 'Event not found' };
        }

        const eventToDelete = await prisma.eventeCalendar.findUnique({
            where: { id },
        });

        if (!eventToDelete) {
            return { error: 'Event does not exist' };
        }

        if (eventToDelete.image) {
            await deleteFile(eventToDelete.image);
        }

        const response = await prisma.eventeCalendar.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.DELETE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: id,
            description: `Event "${eventToDelete.name}" deleted`,
            metadata: {
                eventId: id,
                name: eventToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');
        return response;
    } catch (error) {
        console.error('Error delete event', error);
        throw error;
    }
}

export async function updateEvent(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Event ID is required' };
        }

        const currentEvent = await prisma.eventeCalendar.findUnique({
            where: { id },
        });

        if (!currentEvent) {
            return { error: 'Event does not exist' };
        }

        const name = (formData.get('name') as string) || currentEvent.name;
        const imageFile = formData.get('image') as File | null;
        const date = (formData.get('date') as string) || currentEvent.date;
        const description =
            (formData.get('description') as string | null) || currentEvent.description;
        const venue = (formData.get('venue') as string | null) || currentEvent.venue;
        const showTime = (formData.get('showTime') as string | null) || currentEvent.showTime;
        const audienceType =
            (formData.get('audienceType') as string | null) || currentEvent.audienceType;
        const price = (formData.get('price') as string) || currentEvent.price;

        const dateValue = date ? new Date(date) : currentEvent.date;
        const priceValue = price ? Number(price) : Number(currentEvent.price);

        const updateData: {
            name: string;
            image?: string | null;
            date: Date;
            description: string | null;
            venue: string | null;
            showTime: string | null;
            audienceType: string | null;
            price: number;
        } = {
            name,
            date: dateValue,
            description,
            venue,
            showTime,
            audienceType,
            price: priceValue,
        };

        let newImageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                // Primero subimos la nueva imagen
                newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'teams',
                    prefix: 'team-',
                });

                // Si la subida fue exitosa y existe una imagen anterior, la eliminamos
                if (newImageUrl && currentEvent.image) {
                    await deleteFile(currentEvent.image);
                }

                updateData.image = newImageUrl;
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.eventeCalendar.update({
            where: { id },
            data: updateData,
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.EVENTS.UPDATE,
            entity: AUDIT_ENTITIES.EVENTS,
            entityId: id,
            description: `Event "${name}" updated`,
            metadata: {
                before: {
                    name: currentEvent.name,
                },
                after: {
                    name: response.name,
                },
                changes: {
                    name:
                        name !== currentEvent.name
                            ? { from: currentEvent.name, to: name }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/events');
        return response;
    } catch (error) {
        console.error('Error updating event', error);
        throw error;
    }
}
