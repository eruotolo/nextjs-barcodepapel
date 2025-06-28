'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createEvent } from '@/actions/Administration/EventCalendars';
import BtnActionNew from '@/components/BtnActionNew/BtnActionNew';
import BtnSubmit from '@/components/BtnSubmit/BtnSubmit';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';
import type { UpdateData } from '@/types/settings/Generic/InterfaceGeneric';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FilePenLine } from 'lucide-react';
import { toast } from 'sonner';

export default function NewEventCalendarModal({ refreshAction }: UpdateData) {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<EventeCalendarInterface>({ mode: 'onChange' });

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('/default.png');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setImagePreview('/default.png');
            setSelectedImage(null);
            setError('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const maxSizeInBytes = 4194304; // 4MB

        if (file) {
            if (file.size > maxSizeInBytes) {
                setError('La imagen no puede superar 4MB.');
                e.target.value = '';
                setImagePreview('/default.png');
                setSelectedImage(null);
                return;
            }
            setError('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setSelectedImage(file);
        }
    };

    const onSubmit = async (data: EventeCalendarInterface) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);

        if (data.description) {
            formData.append('description', data.description);
        }
        if (data.venue) {
            formData.append('venue', data.venue);
        }
        if (data.showTime) {
            formData.append('showTime', data.showTime);
        }
        if (data.audienceType) {
            formData.append('audienceType', data.audienceType);
        }
        if (data.price) {
            formData.append('price', data.price);
        }

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await createEvent(formData);

            if (!response) {
                setError('Problemas al crear el evento');
                return;
            }
            refreshAction();
            handleOpenChange(false);
            toast.success('Nuevo Evento Creado', {
                description: 'El evento se ha creado correctamente.',
            });
        } catch (error) {
            reset();
            toast.error('Error al Crear Evento', {
                description: 'Error al intentar crear el evento',
            });
            setImagePreview('/default.png');
            setError('Error al crear el evento. Inténtalo de nuevo.');
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <BtnActionNew label="Nuevo" permission={['Crear']} />
            <DialogContent className="overflow-hidden sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo evento. Asegúrate de que toda la información
                        esté correcta antes de proceder.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2 mr-[15px]">
                            <div className="mb-[15px]">
                                <Label className="custom-label">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nombre del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                />
                                {errors.name && (
                                    <p className="custom-form-error">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Fecha</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('date', {
                                        required: 'La fecha es obligatoria',
                                    })}
                                />
                                {errors.date && (
                                    <p className="custom-form-error">{errors.date.message}</p>
                                )}
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Lugar</Label>
                                <Input
                                    id="venue"
                                    type="text"
                                    placeholder="Lugar del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('venue')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Hora del Espectáculo</Label>
                                <Input
                                    id="showTime"
                                    type="time"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('showTime')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Tipo de Audiencia</Label>
                                <Input
                                    id="audienceType"
                                    type="text"
                                    placeholder="Tipo de audiencia"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('audienceType')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Precio</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="Precio del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('price')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Label className="custom-label">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descripción del evento"
                                    className="w-full"
                                    autoComplete="off"
                                    {...register('description')}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <Image
                                src={imagePreview}
                                width={220}
                                height={220}
                                alt="Vista previa de la imagen"
                                className="h-[220px] w-[220px] rounded-[3%] object-cover"
                            />
                            <label
                                htmlFor="file-upload-event"
                                className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Imagen Evento
                            </label>
                            <Input
                                id="file-upload-event"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <DialogFooter className="items-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <BtnSubmit label="Crear" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
