export interface Category {
    id: string;
    name: string;
    image: any;
    gender: 'men' | 'women' | 'unisex';
}

export interface Product {
    id: string;
    title: string;
    name?: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    images: any[];
    categoryId: string;
    tags: string[];
    colors: string[];
    sizes: string[];
    isExclusive?: boolean;
    description?: string;
    isNewArrival?: boolean;
    isPopular?: boolean;
    isPriceDropping?: boolean;
    discountPercent?: number;
    subCategory?: string;
    type?: string;
    isSale?: boolean;
}
