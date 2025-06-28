'use client';

import { getCategoryById, updateCategory } from '@/actions/Administration/Categories';
import type { EditModalProps } from '@/types/settings/Generic/InterfaceGeneric';
import Form from 'next/form';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditCategoryModal({ id, refreshAction, open, onCloseAction }: EditModalProps) {
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        async function loadCategory() {
            if (id && open) {
                try {
                    const category = await getCategoryById(id);
                    if (category) {
                        setName(category.name || '');
                    }
                } catch (e) {
                    console.error('Error loading category:', e);
                    setError('Error al cargar la categoría');
                }
            }
        }

        loadCategory();
    }, [id, open]);

    const onSubmit = async (formData: FormData) => {
        const name = formData.get('name');

        if (!name || typeof name !== 'string' || name.trim() === '') {
            setError('El nombre es requerido');
            return;
        }

        try {
            const response = await updateCategory(id, formData);
            if ('error' in response) {
                setError(response.error);
                return;
            }
            refreshAction();
            onCloseAction(false);
            toast.success('Categoría Actualizada', {
                description: 'La categoría se ha actualizado correctamente.',
            });
        } catch (error) {
            setError('Error al actualizar la categoría. Inténtalo de nuevo.');
            console.error(error);
            toast.error('Actualización Fallida', {
                description: 'Error al intentar actualizar la categoría',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="overflow-hidden sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Categoría</DialogTitle>
                    <DialogDescription>Modifica el nombre de la categoría existente.</DialogDescription>
                </DialogHeader>
                <Form action={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Label className="custom-label">Nombre de la Categoría</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nombre de la categoría"
                            className="w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error && <p className="custome-form-error">{error}</p>}
                    </div>
                    <DialogFooter className="mt-6 items-end">
                        <Button type="submit" className="custom-button">
                            Actualizar
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 