import Image from 'next/image';

export default function ManifiestoPage() {
    const imageHeader = '/image-header-page.png';

    return (
        <>
            <main className="bg-web">
                <Image
                    src={imageHeader}
                    alt="Imagen Header Page"
                    width={2200}
                    height={299}
                    className="object-cover object-top"
                />
            </main>
        </>
    );
}
