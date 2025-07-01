import Image from 'next/image';
import { getAllTeamsHome } from '@/actions/Administration/Teams/queries';

export default async function Teams() {
    const teams = await getAllTeamsHome();

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-12 md:gap-8 lg:grid-cols-3">
            {teams.map((team) => (
                <article key={team.id} className="text-center">
                    {/* Imagen con placeholder */}
                    <div className="relative mb-4 h-[200px] w-full overflow-hidden rounded-[10px] border-2 border-gray-300 sm:h-[240px] md:h-[280px]">
                        {team.image ? (
                            <Image src={team.image} alt={team.name} fill className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <div className="text-[48px] text-gray-400 sm:text-[56px] md:text-[64px]">=d</div>
                            </div>
                        )}
                    </div>

                    {/* Nombre */}
                    <h2 className="font-basic-sans mb-2 text-[16px] leading-[20px] font-semibold uppercase text-negro sm:mb-3 sm:text-[18px] sm:leading-[22px] md:mb-4 md:text-[20px] md:leading-[24px]">
                        {team.name}
                    </h2>

                    {/* Descripción */}
                    <p className="font-basic-sans text-[13px] leading-[16px] text-negro sm:text-[14px] sm:leading-[17px] md:text-[15px] md:leading-[18px]">
                        {team.description}
                    </p>
                </article>
            ))}
        </div>
    );
}
