export interface EventeCalendarInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    venue?: string; // Lugar
    showTime?: string; // Hora del espectáculo
    audienceType?: string; // Tipo de público
    price: string;
    linkUrl?: string; // Nuevo campo agregado
    eventCategoryId: string; // Nuevo campo requerido
    eventCategory?: {
        id: string;
        name: string;
    }; // Relación con la categoría
    createdAt?: string;
}

export interface EventeCalendarUniqueInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    venue?: string | null; // Lugar
    showTime?: string; // Hora del espectáculo
    audienceType?: string | null;
    price: string;
    linkUrl?: string | null; // Nuevo campo agregado
    eventCategoryId: string; // Nuevo campo requerido
    eventCategory?: {
        id: string;
        name: string;
    }; // Relación con la categoría
    createdAt?: string;
}
