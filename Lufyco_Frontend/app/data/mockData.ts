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
    brand?: string;
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
}

import { MOCK_PRODUCTS } from './mockProducts';

export const mockCategories: Category[] = [
    // Men's Wear
    { id: 'cat_shirts', name: 'SHIRTS', image: require('../../assets/images/categories/slider/SHIRTS.jpg'), gender: 'men' },
    { id: 'cat_jeans', name: 'JEANS', image: require('../../assets/images/categories/slider/JEANS.jpg'), gender: 'men' },
    { id: 'cat_tshirts', name: 'TSHIRTS', image: require('../../assets/images/categories/slider/TSHIRTS.jpg'), gender: 'men' },
    { id: 'cat_casual_shoes', name: 'CASUAL SHOES', image: require('../../assets/images/categories/slider/CASUAL SHOES.jpg'), gender: 'men' },
    { id: 'cat_sweater', name: 'SWEATER', image: require('../../assets/images/categories/slider/SWEATER.jpg'), gender: 'men' },
    { id: 'cat_sports_shoes', name: 'SPORTS SHOES', image: require('../../assets/images/categories/slider/SPORTS SHOES.jpg'), gender: 'men' },
    // Women's Wear
    { id: 'cat_dresses', name: 'TROUSERS', image: require('../../assets/images/categories/slider/TROUSERS.jpg'), gender: 'women' },
    { id: 'cat_tops', name: 'KURTAS', image: require('../../assets/images/categories/slider/KURTAS.jpg'), gender: 'women' },
    { id: 'cat_trousers', name: 'JACKETS', image: require('../../assets/images/categories/slider/JACKETS.jpg'), gender: 'men' },
    { id: 'cat_heels', name: 'WATCHES', image: require('../../assets/images/categories/slider/WATCHES.jpg'), gender: 'women' },
    { id: 'cat_jackets', name: 'BOTTLES', image: require('../../assets/images/categories/slider/BOTTLES.jpg'), gender: 'men' },
    { id: 'cat_kurtas', name: 'PERFUME', image: require('../../assets/images/categories/slider/PERFUME.jpg'), gender: 'women' },
    // Beauty Products
    { id: 'cat_skincare', name: 'DRESSES', image: require('../../assets/images/categories/slider/DRESSES.jpg'), gender: 'unisex' },
    { id: 'cat_makeup', name: 'TOPS', image: require('../../assets/images/categories/slider/TOPS.jpg'), gender: 'unisex' },
    { id: 'cat_haircare', name: 'TROUSERS', image: require('../../assets/images/categories/slider/TROUSERS (2).jpg'), gender: 'unisex' },
    { id: 'cat_nailpolish', name: 'HEELS', image: require('../../assets/images/categories/slider/HEELS.jpg'), gender: 'unisex' },
    { id: 'cat_perfume', name: 'JACKETS', image: require('../../assets/images/categories/slider/JACKETS (2).jpg'), gender: 'unisex' },
    // Jewellery
    { id: 'cat_necklaces', name: 'KURTAS', image: require('../../assets/images/categories/slider/KURTAS (2).jpg'), gender: 'unisex' },
    { id: 'cat_rings', name: 'SAREES', image: require('../../assets/images/categories/slider/SAREES.jpg'), gender: 'unisex' },
    { id: 'cat_earrings', name: 'JEANS', image: require('../../assets/images/categories/slider/JEANS (2).jpg'), gender: 'unisex' },
    { id: 'cat_bracelets', name: 'HANDBAGS', image: require('../../assets/images/categories/slider/HANDBAGS.jpg'), gender: 'unisex' },
    // Accessories
    { id: 'cat_handbags', name: 'PERFUME', image: require('../../assets/images/categories/slider/PERFUME (2).jpg'), gender: 'unisex' },
    { id: 'cat_watches', name: 'SPORTS SHOES', image: require('../../assets/images/categories/slider/SPORTS SHOES (2).jpg'), gender: 'unisex' },
    { id: 'cat_belts', name: 'BOTTLES', image: require('../../assets/images/categories/slider/BOTTLES (2).jpg'), gender: 'unisex' },
    { id: 'cat_sunglasses', name: 'Sunglasses', image: require('../../assets/images/categories/accessories/sunglasses.jpg'), gender: 'unisex' },
];

// Helper to map category name to ID
const getCatId = (name: string) => {
    const cat = mockCategories.find(c => c.name === name);
    return cat ? cat.id : 'c1';
};

// Helper to Generate 10 products for EACH category
const generatedCategoryProducts: Product[] = [];

mockCategories.forEach((cat) => {
    for (let i = 1; i <= 10; i++) {
        generatedCategoryProducts.push({
            id: `${cat.id}_p${i}`,
            title: `${cat.name} Item ${i}`,
            price: Math.floor(Math.random() * (8000 - 1500) + 1500), // Random price 1500 - 8000
            rating: 4.0 + (i % 10) / 10,
            reviews: Math.floor(Math.random() * 200) + 10,
            images: [cat.image], // Use category image as placeholder
            categoryId: cat.id,
            tags: [cat.name.toLowerCase(), 'fashion', 'trend'],
            colors: ['#000000', '#FFFFFF', '#1F2937'],
            sizes: ['S', 'M', 'L', 'XL'],
            isNewArrival: i <= 2, // First 2 are new
            isPopular: i > 2 && i <= 4,
            isPriceDropping: i === 5,
            oldPrice: (i === 5 || i === 2) ? Math.floor(Math.random() * (12000 - 9000) + 9000) : undefined, // Add oldPrice for item 5 and 2
        });
    }
});

export const mockProducts: Product[] = [
    ...generatedCategoryProducts,
    // Add a few specific "featured" items if needed, or just rely on the generated ones
    {
        id: 'feat_1',
        title: 'Premium Leather Watch',
        price: 12500,
        rating: 4.9,
        reviews: 120,
        images: [require('../../assets/images/categories/men/watches.jpg')],
        categoryId: 'cat_accessories', // Ensure this ID exists or map to one of the above
        tags: ['watch', 'luxury'],
        colors: ['#8B4513'],
        sizes: ['One Size'],
        isExclusive: true,
    }
];
