'use client';

import AlterHeader from '@/components/Home/Header/AlterHeader';
import HeaderWeb from '@/components/Home/Header/Header';
import { usePathname } from 'next/navigation';

export default function DynamicHeader() {
    const pathname = usePathname();

    return pathname === '/' ? <HeaderWeb /> : <AlterHeader />;
}
