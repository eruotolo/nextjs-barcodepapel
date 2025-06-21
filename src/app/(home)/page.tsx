import Image from 'next/image';

export default function Home() {
    const imageSlider = '/image-home-01.png';

    return (
        <main className="bg-web">
            <section className="mt-[-120px]">
                <Image
                    src={imageSlider}
                    alt="Imagen Slider"
                    width={2200}
                    height={1315}
                    className="object-cover object-top"
                    loading={'lazy'}
                />
            </section>

            <section className="container mx-auto max-w-[1100px]">
                <div className="h-[1000px]">
                    <h1 className="font-basic-sans">Hola Mundo!</h1>
                    <h1>Hola Mundo!</h1>
                </div>

                <section className="h-[1000px]">
                    <h1>Hola</h1>
                </section>
            </section>
        </main>
    );
}
