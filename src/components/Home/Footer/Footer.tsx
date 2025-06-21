import { Instagram, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    const logoFooter = '/logo-footer.svg';
    const logoMinisterior = '/logo-ministerio.svg';

    return (
        <>
            <footer className="bg-azul">
                <div className="container mx-auto max-w-[1100px]">
                    <div className="grid grid-cols-3 items-center md:h-[160px]">
                        <div>
                            <Image
                                src={logoMinisterior}
                                alt="Logo Ministerio"
                                width={245}
                                height={91}
                                className="md:w-[180px]"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Image
                                src={logoFooter}
                                alt="Logo Footer"
                                width={341}
                                height={143}
                                className="md:w-[220px]"
                            />
                        </div>
                        <div className="flex justify-end">
                            <a
                                href="https://www.instagram.com/revistabarcodepapel/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-negro mr-[8px] rounded-[50%] p-[6px]"
                            >
                                <Instagram size={26} className="text-blanco" />
                            </a>
                            <a
                                href="mailto:catabilleke@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-negro mr-[8px] rounded-[50%] p-[6px]"
                            >
                                <Mail size={26} className="text-blanco" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
