import type {
    BlogCategoryInterface,
    CategoryInterface,
} from '@/types/Administration/Blog/CategoryInterface';

export interface BlogInterface {
    id: string;
    name: string;
    image: string | null;
    author: string;
    primaryCategoryId?: string | null;
    primaryCategory?: CategoryInterface | null;
    BlogCategory: BlogCategoryInterface[];
    createdAt: string;
}

export interface BlogUniqueInterface {
    id: string;
    name: string;
    image: string | null;
    primaryCategoryId?: string | null;
    primaryCategory?: CategoryInterface | null;
    author: string;
    description: string;
}
