import { getEventMonth } from '@/actions/Administration/EventCalendars/queries';
import Image from 'next/image';

export default async function Cartelera() {
    const upcomingEvents = await getEventMonth();

    return (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
                <article key={event.id}>
                    <div className="mb-[10px]">
                        <h3 className="font-basic-sans font-semibold text-[#f50a86] uppercase md:text-[18px]">
                            EVENTO
                        </h3>
                    </div>

                    {event.image ? (
                        <div className="relative w-full md:h-[280px]">
                            <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                className="rounded-[10px] object-cover"
                            />
                        </div>
                    ) : (
                        <div className="relative flex w-full items-center justify-center rounded-[10px] bg-gray-200 md:h-[280px]">
                            <div className="p-4 text-center">
                                <div className="mb-2 text-4xl font-bold text-gray-600">📅</div>
                                <div className="text-sm text-gray-500 uppercase">Evento</div>
                            </div>
                        </div>
                    )}

                    <div className="px-[6px] py-[16px]">
                        <h2 className="font-basic-sans text-negro font-normal md:text-[20px] md:leading-[24px]">
                            {event.name}
                        </h2>

                        <div className="flex flex-row md:py-[15px]">
                            <h4 className="font-basic-sans text-negro mr-[5px] font-normal md:text-[18px] md:leading-[18px]">
                                Fecha:
                            </h4>
                            <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                {event.date}
                            </h4>
                        </div>

                        {event.venue && event.venue !== '' && (
                            <div className="flex flex-row md:py-[5px]">
                                <h4 className="font-basic-sans text-negro mr-[5px] font-normal md:text-[18px] md:leading-[18px]">
                                    Lugar:
                                </h4>
                                <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                    {event.venue}
                                </h4>
                            </div>
                        )}

                        {event.showTime && event.showTime !== 'Sin hora' && (
                            <div className="flex flex-row md:py-[5px]">
                                <h4 className="font-basic-sans text-negro mr-[5px] font-normal md:text-[18px] md:leading-[18px]">
                                    Hora:
                                </h4>
                                <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                    {event.showTime}
                                </h4>
                            </div>
                        )}

                        {event.price && event.price !== '' && (
                            <div className="flex flex-row md:py-[5px]">
                                <h4 className="font-basic-sans text-negro mr-[5px] font-normal md:text-[18px] md:leading-[18px]">
                                    Precio:
                                </h4>
                                <h4 className="font-basic-sans text-negro font-normal italic md:text-[18px] md:leading-[18px]">
                                    ${event.price}
                                </h4>
                            </div>
                        )}

                        <div>
                            <p className="font-basic-sans text-[#575756] md:text-[14px] md:leading-[14px]">
                                Próximos 30 días
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
