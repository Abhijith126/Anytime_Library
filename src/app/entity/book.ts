export interface Book {
    title: string;
    isbn: string;
    author: string;
    categories: string;
    publisher: string;
    year: string;
    ratings: number;
    count?: number;
    coverUrl: string;
    description: string;
    location?: string;
}
