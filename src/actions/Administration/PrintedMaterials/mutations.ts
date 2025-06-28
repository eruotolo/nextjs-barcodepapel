'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';

export async function createMaterial(formData: FormData) {
    try {
        const imageFile = formData.get('image') as File | null;
        const numberVersion = Number(formData.get('numberVersion'));
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const link = formData.get('link') as string;

        if (!name) {
            return { error: 'Teams name required' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'material',
                    prefix: 'material-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.printedMaterial.create({
            data: {
                image: imageUrl,
                numberVersion,
                name,
                description,
                link,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.MATERIALS.CREATE,
            entity: AUDIT_ENTITIES.MATERIALS,
            entityId: response.id,
            description: `Material "${name}" created`,
            metadata: {
                materialId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/materials');
        return response;
    } catch (error) {
        console.error('Error creating material', error);
        throw error;
    }
}

export async function deleteMaterial(id: string) {
    try {
        if (!id) {
            return { error: 'Material not found' };
        }

        const materialToDelete = await prisma.printedMaterial.findUnique({
            where: { id },
            select: { image: true },
        });

        if (!materialToDelete) {
            return { error: 'Material does not exist' };
        }

        if (materialToDelete.image) {
            await deleteFile(materialToDelete.image);
        }

        const response = await prisma.printedMaterial.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.MATERIALS.DELETE,
            entity: AUDIT_ENTITIES.MATERIALS,
            entityId: response.id,
            description: `Material "${response.name}" deleted`,
            metadata: {
                materialId: response.id,
                name: response.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/materials');
        return response;
    } catch (error) {
        console.error('Error delete material', error);
        throw error;
    }
}

export async function updateMaterial(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Material ID is required' };
        }

        const currentTeam = await prisma.printedMaterial.findUnique({
            where: { id },
        });

        if (!currentTeam) {
            return { error: 'Material does not exist' };
        }

        const imageFile = formData.get('image') as File | null;
        const numberVersion = Number(formData.get('numberVersion'));
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const link = formData.get('link') as string;

        let newImageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'material',
                    prefix: 'material-',
                });

                // Si la subida fue exitosa y existe una imagen anterior, la eliminamos
                if (newImageUrl && currentTeam.image) {
                    await deleteFile(currentTeam.image);
                }
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.printedMaterial.update({
            where: { id },
            data: {
                image: newImageUrl,
                numberVersion,
                name,
                description,
                link,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.MATERIALS.UPDATE,
            entity: AUDIT_ENTITIES.MATERIALS,
            entityId: response.id,
            description: `Material "${name}" updated`,
            metadata: {
                materialId: response.id,
                name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/materials');
        return response;
    } catch (error) {
        console.error('Error updating material', error);
        throw error;
    }
}
