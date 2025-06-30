'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
    getEventMonth,
    getEventMonthLimited,
} from '@/actions/Administration/EventCalendars/queries';
import type { EventeCalendarInterface } from '@/types/Administration/EventCalendars/EventeCalendarInterface';

// Función para obtener la abreviación del mes en español
function getMonthAbbreviation(dateString: string): string {
    const monthMap: { [key: string]: string } = {
        enero: 'ENE',
        febrero: 'FEB',
        marzo: 'MAR',
        abril: 'ABR',
        mayo: 'MAY',
        junio: 'JUN',
        julio: 'JUL',
        agosto: 'AGO',
        septiembre: 'SEP',
        octubre: 'OCT',
        noviembre: 'NOV',
        diciembre: 'DIC',
    };

    // La fecha viene en formato "día de mes" (ej: "15 de enero")
    const monthName = dateString.split(' ').pop()?.toLowerCase() || '';
    return monthMap[monthName] || 'MES';
}

export default function Cartelera() {
    const [limitedEvents, setLimitedEvents] = useState<EventeCalendarInterface[]>([]);
    const [allEvents, setAllEvents] = useState<EventeCalendarInterface[]>([]);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const limited = await getEventMonthLimited(3);
                setLimitedEvents(limited);
            } catch (error) {
                console.error('Error cargando eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const handleShowAllEvents = async () => {
        if (!showAllEvents && allEvents.length === 0) {
            try {
                setLoading(true);
                const all = await getEventMonth();
                setAllEvents(all);
            } catch (error) {
                console.error('Error cargando todos los eventos:', error);
            } finally {
                setLoading(false);
            }
        }
        setShowAllEvents(!showAllEvents);
    };

    const eventsToShow = showAllEvents ? allEvents : limitedEvents;
    const hasMoreEvents = limitedEvents.length >= 3;

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-lg text-gray-600">Cargando eventos...</div>
                </div>
            ) : (
                <>
                    <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {eventsToShow.map((event) => (
                            <article key={event.id}>
                                <div className="mb-[10px]">
                                    <h3 className="font-basic-sans text-negro font-semibold md:text-[18px]">
                                        {event.eventCategory?.name || 'Sin categoría'}
                                    </h3>
                                </div>

                                {event.image ? (
                                    <div className="relative w-full overflow-hidden rounded-[10px] border-2 border-black md:h-[280px]">
                                        <Image
                                            src={event.image}
                                            alt={event.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-[190px] right-4 rounded-lg bg-pink-500 px-[20px] py-2 font-bold text-white">
                                            <div className="flex flex-col items-center">
                                                <div className="text-[20px] uppercase">
                                                    {getMonthAbbreviation(event.date)}
                                                </div>
                                                <div className="text-[28px] leading-none">
                                                    {event.date.split(' ')[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative flex w-full items-center justify-center rounded-[10px] border-2 border-black bg-gray-200 md:h-[280px]">
                                        <div className="p-4 text-center">
                                            <div className="mb-2 text-4xl font-bold text-gray-600">
                                                📅
                                            </div>
                                            <div className="text-sm text-gray-500 uppercase">
                                                Evento
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 rounded-lg bg-pink-500 px-3 py-2 font-bold text-white">
                                            <div className="text-xs uppercase">
                                                {getMonthAbbreviation(event.date)}
                                            </div>
                                            <div className="text-lg leading-none">
                                                {event.date.split(' ')[0]}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="px-[6px] py-[16px]">
                                    <h2 className="font-basic-sans text-negro mb-[15px] font-normal md:text-[20px] md:leading-[24px]">
                                        {event.name}
                                    </h2>

                                    {event.venue && event.venue !== '' && (
                                        <div className="flex flex-row md:py-[5px]">
                                            <h4 className="font-basic-sans mr-[5px] font-normal text-[#575756] md:text-[18px] md:leading-[18px]">
                                                Lugar:
                                            </h4>
                                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                                {event.venue}
                                            </h4>
                                        </div>
                                    )}

                                    {event.showTime && event.showTime !== 'Sin hora' && (
                                        <div className="flex flex-row md:py-[5px]">
                                            <h4 className="font-basic-sans mr-[5px] font-normal text-[#575756] md:text-[18px] md:leading-[18px]">
                                                Hora:
                                            </h4>
                                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                                {event.showTime}
                                            </h4>
                                        </div>
                                    )}

                                    {event.audienceType && event.audienceType !== '' && (
                                        <div className="flex flex-row md:py-[5px]">
                                            <h4 className="font-basic-sans mr-[5px] font-normal text-[#575756] md:text-[18px] md:leading-[18px]">
                                                Público:
                                            </h4>
                                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                                {event.audienceType}
                                            </h4>
                                        </div>
                                    )}

                                    {event.price && event.price !== '' && (
                                        <div className="flex flex-row md:py-[5px]">
                                            <h4 className="font-basic-sans mr-[5px] font-normal text-[#575756] md:text-[18px] md:leading-[18px]">
                                                Costo:
                                            </h4>
                                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                                ${event.price}
                                            </h4>
                                        </div>
                                    )}

                                    {event.linkUrl && event.linkUrl !== '' && (
                                        <div className="mt-[30px] flex justify-center">
                                            <a
                                                href={event.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-negro text-fucsia hover:bg-fucsia hover:text-negro inline-block rounded-lg px-[24px] py-[10px] text-[18px] leading-[18px] font-medium transition-colors"
                                            >
                                                Ir al sitio web
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {hasMoreEvents && (
                        <div className="mt-8 flex justify-center md:mt-[70px]">
                            <button
                                type="button"
                                onClick={handleShowAllEvents}
                                disabled={loading}
                                className="bg-fucsia text-negro hover:bg-negro hover:text-fucsia font-basic-sans cursor-pointer rounded-[10px] px-[24px] py-[10px] text-[18px] leading-[18px] font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? 'Cargando...'
                                    : showAllEvents
                                      ? 'Cargar menos'
                                      : 'Cargar más'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
