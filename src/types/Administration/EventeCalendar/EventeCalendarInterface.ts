export interface EventeCalendarInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    description?: string;
    venue?: string; // Lugar
    showTime?: string; // Hora del espectáculo
    audienceType?: string;
    price: string;
    createdAt?: string;
}

export interface EventeCalendarUniqueInterface {
    id: string;
    name: string;
    image?: string | null;
    date: string;
    description?: string | null;
    venue?: string | null; // Lugar
    showTime?: string; // Hora del espectáculo
    audienceType?: string | null;
    price: string;
    createdAt?: string;
}
