import {
    Frame,
    LayoutDashboard,
    LifeBuoy,
    Newspaper,
    PieChart,
    Settings2,
    Shield,
} from 'lucide-react';

export const navData = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin/dashboard',
            icon: LayoutDashboard,
            roles: [],
        },
        {
            title: 'Noticas',
            url: '/admin/administration/blog',
            icon: Newspaper,
            roles: [],
        },
    ],

    navSetting: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            roles: [],
            items: [
                {
                    title: 'Usuarios',
                    url: '/admin/settings/users',
                    roles: [],
                },
            ],
        },
        {
            title: 'Ayuda',
            url: '/admin/settings/tickets',
            icon: LifeBuoy,
            roles: [],
        },
    ],

    adminSetting: [
        {
            title: 'Privado',
            url: '#',
            icon: Shield,
            roles: ['SuperAdministrador'],
            items: [
                {
                    title: 'Auditoria',
                    url: '/admin/settings/audit',
                    roles: ['SuperAdministrador'],
                },
                {
                    title: 'Permisos',
                    url: '/admin/settings/permissions',
                    roles: ['SuperAdministrador'],
                },
            ],
        },
    ],
};
