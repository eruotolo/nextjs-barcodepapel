interface HeaderMenu {
    id: number;
    name: string;
    link: string;
}

export const items: HeaderMenu[] = [
    {
        id: 1,
        name: 'Home',
        link: '/',
    },
    {
        id: 2,
        name: 'Revista Impresa',
        link: '/impresos',
    },
    {
        id: 3,
        name: 'Entrevistas',
        link: '/entrevistas',
    },
    {
        id: 4,
        name: 'Articulos',
        link: '/articulos',
    },
    {
        id: 5,
        name: 'Sonidos Local',
        link: '/sonidos',
    },
    {
        id: 6,
        name: 'Bitácora Visual',
        link: '/',
    },
    {
        id: 7,
        name: 'Cartelera',
        link: '/',
    },
];

export const itemsAlter: HeaderMenu[] = [
    {
        id: 1,
        name: 'Manifiesto',
        link: '/manifiesto',
    },
    {
        id: 2,
        name: 'Quienes Somos',
        link: '/somos',
    },
];
