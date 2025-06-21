import type {
    BlogCategoryInterface,
    CategoryInterface,
} from '@/types/Administration/Blog/CategoryInterface';

export interface BlogInterface {
    id: string;
    name: string;
    image: string | null;
    author: string;
    primaryCategoryId: string;
    primaryCategory: CategoryInterface;
    BlogCategory: BlogCategoryInterface[];
    createdAt: string;
}

export interface BlogUniqueInterface {
    id: string;
    name: string;
    image?: string | null;
    primaryCategoryId: string;
    primaryCategory: CategoryInterface;
    author: string;
    description: string;
}
