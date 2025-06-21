'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { items, itemsAlter } from '@/components/Home/Header/HeaderMenu';
import HeaderRedes from '@/components/Home/Header/HeaderRedes';

export default function AlterHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const logo: string = '/logo-header.svg';

    return (
        <>
            <header className="z-50">
                <div className="md:bg-negro w-full">
                    <div className="mx-auto md:max-w-[1100px]">
                        <nav className="flex h-[120px] items-center justify-between">
                            <div>
                                <Link href="/">
                                    <Image
                                        src={logo}
                                        alt="Logo Principal"
                                        width={339}
                                        height={147}
                                        sizes="(max-width: 768px) 100vw, 200px"
                                        className="md:w-[200px]"
                                    />
                                </Link>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={toggleMenu}
                                    aria-label="Abrir menú"
                                    className="bg-negro border-blanco hover:border-fucsia rounded-[50%] border-[1px] p-[5px] drop-shadow-md transition-colors duration-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        data-slot="icon"
                                        className="group-hover:stroke-fucsia hover:stroke-fucsia h-9 w-9 cursor-pointer text-white transition-colors duration-300"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                <div
                    className={
                        menuOpen
                            ? 'menu-mobile'
                            : 'fixed top-0 left-[-100%] h-screen p-10 duration-500 ease-in-out'
                    }
                >
                    <div className="flex w-full items-center justify-end">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            aria-label="Cerrar menú"
                            className="bg-negro hover:border-fucsia rounded-[50%] border-[1px] border-white p-[5px] transition-colors duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="white"
                                data-slot="icon"
                                className="group-hover:stroke-fucsia hover:stroke-fucsia h-8 w-8 cursor-pointer transition-colors duration-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="container mx-auto flex h-[85vh] max-w-[1100px] items-center justify-between">
                        <div>
                            <ul>
                                {items.map((item) => (
                                    <li key={item.id} className="my-[18px]">
                                        <Link
                                            href={item.link}
                                            passHref
                                            onClick={() => setMenuOpen(false)}
                                            className="font-basic-sans text-blanco hover:text-fucsia text-[20px] uppercase"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col items-end">
                            <ul className="mb-[50px]">
                                {itemsAlter.map((item) => (
                                    <li key={item.id} className="my-[18px] flex justify-end">
                                        <Link
                                            href={item.link}
                                            passHref
                                            onClick={() => setMenuOpen(false)}
                                            className="font-basic-sans text-blanco hover:text-fucsia text-[20px] uppercase"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="mailto:catabilleke@gmail.com"
                                className="text-fucsia font-basic-sans text-[20px]"
                                target="_blank"
                                rel="noreferrer"
                            >
                                catabilleke@gmail.com
                            </a>
                            <a
                                href="mailto:joja@agenciavolcano.cl"
                                className="text-fucsia font-basic-sans text-[20px]"
                                target="_blank"
                                rel="noreferrer"
                            >
                                joja@agenciavolcano.cl
                            </a>
                            <HeaderRedes />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
