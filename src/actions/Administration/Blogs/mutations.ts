'use server';

import { deleteFile, uploadFile } from '@/lib/blob/uploadFile';
import prisma from '@/lib/db/db';
import { revalidatePath } from 'next/cache';

import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth';

export async function createPost(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const imageFile = formData.get('image') as File | null;
        const primaryCategoryId = formData.get('primaryCategoryId') as string;
        const author = formData.get('author') as string;
        const description = formData.get('description') as string;

        if (!name || !primaryCategoryId || !author || !description) {
            return { error: 'Required fields are missing' };
        }

        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            try {
                imageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'blog',
                    prefix: 'post-',
                });
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.blog.create({
            data: {
                name,
                primaryCategoryId,
                author,
                description,
                image: imageUrl,
            },
            include: {
                primaryCategory: true,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.CREATE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: response.id,
            description: `Post "${name}" created`,
            metadata: {
                blogId: response.id,
                data: {
                    name,
                    primaryCategoryId,
                    author,
                    description,
                    image: imageUrl,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error creating Post', error);
        throw error;
    }
}

export async function deletePost(id: string) {
    try {
        if (!id) {
            return { error: 'Post ID is requeried' };
        }

        const blogToDelete = await prisma.blog.findUnique({
            where: { id },
        });

        if (!blogToDelete) {
            return { error: 'Post does not exist' };
        }

        // Eliminar la imagen si existe
        if (blogToDelete.image) {
            await deleteFile(blogToDelete.image);
        }

        const response = await prisma.blog.delete({
            where: { id },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.DELETE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: id,
            description: `Post "${blogToDelete.name}" deleted`,
            metadata: {
                postId: id,
                name: blogToDelete.name,
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error deleting Post', error);
        throw error;
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        if (!id) {
            return { error: 'Post ID is required' };
        }

        const currentPost = await prisma.blog.findUnique({
            where: { id },
        });

        if (!currentPost) {
            return { error: 'Post does not exist' };
        }

        const name = (formData.get('name') as string) || currentPost.name;
        const primaryCategoryId =
            (formData.get('primaryCategoryId') as string) || currentPost.primaryCategoryId;
        const author = (formData.get('author') as string) || currentPost.author;
        const description = (formData.get('description') as string) || currentPost.description;
        const imageFile = formData.get('image') as File | null;

        const updateData: {
            name: string;
            primaryCategoryId: string;
            author: string;
            description: string;
            image?: string | null;
        } = { name, primaryCategoryId, author, description };

        let newImageUrl: string | null = null;
        // Manejar la subida de imagen si existe
        if (imageFile && imageFile.size > 0) {
            try {
                // Primero subimos la nueva imagen
                newImageUrl = await uploadFile({
                    file: imageFile,
                    folder: 'blog',
                    prefix: 'post-',
                });

                // Si la subida fue exitosa y existe una imagen anterior, la eliminamos
                if (newImageUrl && currentPost.image) {
                    await deleteFile(currentPost.image);
                }

                updateData.image = newImageUrl;
            } catch (error) {
                if (error instanceof Error) {
                    return { error: error.message };
                }
            }
        }

        const response = await prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                primaryCategory: true,
            },
        });

        const session = await getServerSession(authOptions);
        await logAuditEvent({
            action: AUDIT_ACTIONS.BLOG.UPDATE,
            entity: AUDIT_ENTITIES.BLOG,
            entityId: id,
            description: `Post "${name}" updated`,
            metadata: {
                before: {
                    name: currentPost.name,
                    image: currentPost.image,
                    primaryCategoryId: currentPost.primaryCategoryId,
                    author: currentPost.author,
                    description: currentPost.description,
                },
                after: {
                    name: response.name,
                    image: response.image,
                    primaryCategoryId: response.primaryCategoryId,
                    author: response.author,
                    description: response.description,
                },
                changes: {
                    name:
                        name !== currentPost.name
                            ? { from: currentPost.name, to: name }
                            : undefined,
                    image: newImageUrl ? { from: currentPost.image, to: newImageUrl } : undefined,
                    primaryCategoryId:
                        primaryCategoryId !== currentPost.primaryCategoryId
                            ? { from: currentPost.primaryCategoryId, to: primaryCategoryId }
                            : undefined,
                    author:
                        author !== currentPost.author
                            ? { from: currentPost.author, to: author }
                            : undefined,
                    description:
                        description !== currentPost.description
                            ? { from: currentPost.description, to: description }
                            : undefined,
                },
            },
            userId: session?.user?.id,
            userName: session?.user?.name
                ? `${session.user.name} ${session.user.lastName || ''}`.trim()
                : undefined,
        });

        revalidatePath('/admin/administration/blog');
        return response;
    } catch (error) {
        console.error('Error updating post', error);
        throw error;
    }
}
