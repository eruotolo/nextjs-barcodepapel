'use client';

import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteEvent } from '@/actions/Administration/EventCalendars';
import { BtnDeleteCell, BtnEditCell } from '@/components/BtnActionCell/BtnActionCell';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';

interface ActionCellProps {
    row: {
        original: EventeCalendarInterface;
    };
    refreshTable: () => Promise<void>;
}

const DynamicEditEventCalendarModal = dynamic(
    () => import('@/components/Modal/Administration/EventCalendars/EditEventCalendarModal'),
    { ssr: false },
);

function ActionCell({ row, refreshTable }: ActionCellProps) {
    const eventId = row.original.id;
    const [openEditEvent, setOpenEditEvent] = useState(false);

    const handleEditEventCloseModal = () => {
        setOpenEditEvent(false);
    };

    const handleDelete = async (eventId: string) => {
        try {
            const success = await deleteEvent(eventId);
            if (success) {
                refreshTable();
                toast.success('Evento Eliminado', {
                    description: 'El evento se ha eliminado correctamente.',
                });
            } else {
                toast.error('Error', {
                    description: 'No se pudo eliminar el evento',
                });
            }
        } catch (error) {
            console.error('Error al eliminar el evento', error);
            toast.error('Error', {
                description: 'Ocurrió un error al eliminar el evento',
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <BtnEditCell
                        onAction={() => setOpenEditEvent(true)}
                        label="Editar Evento"
                        permission={['Editar']}
                        className="cursor-pointer"
                    />
                    <BtnDeleteCell
                        onDelete={handleDelete}
                        label="Eliminar Evento"
                        itemId={eventId}
                        permission={['Eliminar']}
                        className="cursor-pointer text-red-600"
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            {openEditEvent && (
                <DynamicEditEventCalendarModal
                    id={eventId}
                    refreshAction={refreshTable}
                    open={openEditEvent}
                    onCloseAction={handleEditEventCloseModal}
                />
            )}
        </>
    );
}

export const EventCalendarsColumns = (
    refreshTable: () => Promise<void>,
): ColumnDef<EventeCalendarInterface>[] => [
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }: { column: Column<EventeCalendarInterface> }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Nombre del Evento
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const name = `${row.original.name}`;
            return <div className="font-medium">{name}</div>;
        },
    },
    {
        id: 'Categoria',
        accessorKey: 'eventCategory.name',
        header: () => <div>Categoría</div>,
        cell: ({ row }) => {
            const categoryName = row.original.eventCategory?.name || 'Sin categoría';
            return <div className="text-sm text-gray-600">{categoryName}</div>;
        },
    },
    {
        id: 'Fecha',
        accessorKey: 'date',
        header: () => <div>Fecha</div>,
        cell: ({ row }) => {
            const date = `${row.original.date}`;
            return <div>{date}</div>;
        },
    },
    {
        id: 'Hora',
        accessorKey: 'showTime',
        header: () => <div>Hora</div>,
        cell: ({ row }) => {
            const showTime = `${row.original.showTime || 'Sin hora'}`;
            return <div>{showTime}</div>;
        },
    },
    {
        id: 'Precio',
        accessorKey: 'price',
        header: () => <div>Precio</div>,
        cell: ({ row }) => {
            const price = `${row.original.price || 'Gratis'}`;
            return <div>CLP$ {price}</div>;
        },
    },
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell row={row} refreshTable={refreshTable} />,
    },
];
