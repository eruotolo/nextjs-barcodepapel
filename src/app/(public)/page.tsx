import Image from 'next/image';
import Link from 'next/link';
import Cartelera from '@/components/Home/Cartelera/Cartelera';
import NewsHome from '@/components/Home/NewsHome/NewsHome';

export default async function Home() {
    const imageSlider = '/image-home-01.png';
    const azulMedio = '/azul-medio-alt.png';

    return (
        <main className="bg-web">
            <section className="mt-[-120px] h-screen">
                <Image
                    src={imageSlider}
                    alt="Imagen Slider"
                    width={2200}
                    height={1315}
                    className="h-full w-full object-cover object-bottom"
                    loading={'lazy'}
                />
            </section>

            <section className="container mx-auto max-w-[1100px] md:py-[100px]">
                <NewsHome />
                <div className="flex items-center justify-center md:mt-[100px]">
                    <Link
                        href="/noticas"
                        className="font-basic-sans bg-fucsia rounded-[10px] font-normal md:px-[30px] md:py-[12px] md:text-[18px] md:leading-[18px]"
                    >
                        Cargas más
                    </Link>
                </div>
            </section>

            <section className="flex items-center justify-center">
                <Image
                    src={azulMedio}
                    alt="Linea separadora"
                    width={8005}
                    height={1120}
                    className="h-auto w-[100vw]"
                />
            </section>

            <section className="container mx-auto max-w-[1100px] md:py-[100px]">
                <div className="mb-12">
                    <h2 className="mb-4 text-center text-3xl font-bold">Próximos Eventos</h2>
                    <p className="text-center text-gray-600">
                        Descubre los eventos programados para los próximos 30 días
                    </p>
                </div>
                <Cartelera />
            </section>
        </main>
    );
}
