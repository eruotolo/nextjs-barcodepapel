// Next.js imports
import Image from 'next/image';
import Link from 'next/link';
import CarouselSponsors from "@/components/Home/Carousel/Carousel";
// Internal components
import Cartelera from '@/components/Home/Cartelera/Cartelera';
import NewsHome from '@/components/Home/NewsHome/NewsHome';
import Suscribite from '@/components/Home/Suscribite/Suscribite';

export default async function Home() {
    const imageSlider = '/image-home-01.png';
    const azulMedio = '/azul-medio-alt.png';
    const footerBarc = '/footer-barco.png';

    return (
        <main className="bg-web">
            <section className="mt-[-120px] h-screen">
                <Image
                    src={imageSlider}
                    alt="Imagen Slider"
                    width={2200}
                    height={1315}
                    className="h-full w-full object-cover object-bottom"
                    priority
                />
            </section>

            <section className="container mx-auto max-w-[1100px] md:py-[100px]">
                <NewsHome/>
                <div className="flex items-center justify-center md:mt-[100px]">
                    <Link
                        href="/noticias"
                        className="bg-fucsia text-negro hover:bg-negro hover:text-fucsia font-basic-sans rounded-[10px] px-[30px] py-[12px] text-[18px] leading-[18px] font-normal md:px-[30px] md:py-[12px] md:text-[18px] md:leading-[18px]"
                    >
                        Cargar más
                    </Link>
                </div>
                <div className="mt-[70px]">
                    <h1 className="text-azul font-basic-sans text-center text-[40px] font-bold tracking-[4px] md:leading-[44px]">
                        LO QUE SE HEREDA, SE TRANSFORMA Y SE CREA EN ESTE TERRITORIO.
                    </h1>
                </div>
            </section>

            <section className="flex items-center justify-center">
                <Image
                    src={azulMedio}
                    alt="Línea separadora"
                    width={8005}
                    height={1120}
                    className="h-auto w-[100vw]"
                />
            </section>

            <section className="container mx-auto max-w-[1100px] md:pt-[100px]">
                <div className="md:mb-[70px]">
                    <h2 className="font-basic-sans mb-4 text-center leading-[30px] font-bold md:text-[30px]">
                        CARTELERA
                    </h2>
                    <p className="text-fucsia font-basic-sans text-center font-light md:text-[24px]">
                        Descubre los eventos programados para los próximos 30 días
                    </p>
                </div>
                <Cartelera/>
            </section>

            <section className="container mx-auto max-w-[1100px] md:pt-[100px]">
                <div>
                    <h2 className="font-basic-sans mb-4 text-center leading-[30px] font-bold md:text-[30px]">
                        ALIANZAS
                    </h2>
                    <CarouselSponsors/>
                </div>
            </section>

            <section className="container mx-auto max-w-[1100px] md:pt-[100px]">
                <div>
                    <h1 className="text-azul font-basic-sans text-[40px] font-bold tracking-[4px] md:leading-[44px]">
                        ACOMPAÑAMOS LAS PREGUNTAS QUE NOS HACEMOS SOBRE EL LUGAR QUE HABITAMOS.
                    </h1>
                </div>
                <div className="md:mt-[40px]">
                    <Suscribite/>
                </div>
            </section>
            <div className="md:mt-[-260px]">
                <Image
                    src={footerBarc}
                    alt="Footer Barco"
                    width={8000}
                    height={2866}
                    className="h-auto w-[100vw]"
                />
            </div>
        </main>
    );
}
