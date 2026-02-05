export interface Category {
    id: string;
    name: string;
    image: any; // require() path or uri string
}

export interface Product {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    images: any[]; // require() paths or uri strings
    categoryId: string;
    tags: string[];
    colors: string[];
    sizes: string[];
    isExclusive?: boolean;
    description?: string;

    // New fields
    isNewArrival?: boolean;
    isPopular?: boolean;
    isPriceDropping?: boolean;
    discountPercent?: number;
}

import { MOCK_PRODUCTS } from './mockProducts';

export const mockCategories: Category[] = [
    { id: 'cat_shirts', name: 'Shirts', image: require('../../assets/images/categories/men/shirts.png') },
    { id: 'cat_jeans', name: 'Jeans', image: require('../../assets/images/categories/men/jeans.jpg') },
    { id: 'cat_tshirts', name: 'Tshirts', image: require('../../assets/images/categories/men/tshirts.jpg') },
    { id: 'cat_casual_shoes', name: 'Casual Shoes', image: require('../../assets/images/categories/men/casual-shoes.jpg') },
    { id: 'cat_sweater', name: 'Sweater', image: require('../../assets/images/categories/men/sweater.jpg') },
    { id: 'cat_sports_shoes', name: 'Sports Shoes', image: require('../../assets/images/categories/men/sports-shoes.jpg') },
    { id: 'cat_dresses', name: 'Dresses', image: require('../../assets/images/categories/women/dresses.jpg') },
    { id: 'cat_tops', name: 'Tops', image: require('../../assets/images/categories/women/tops.jpg') },
    { id: 'cat_trousers', name: 'Trousers', image: require('../../assets/images/categories/men/trousers.jpg') },
    { id: 'cat_heels', name: 'Heels', image: require('../../assets/images/categories/women/heels.jpg') },
    { id: 'cat_jackets', name: 'Jackets', image: require('../../assets/images/categories/men/jackets.jpg') },
    { id: 'cat_kurtas', name: 'Kurtas', image: require('../../assets/images/categories/women/kurtas.jpg') },
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
            oldPrice: i === 5 ? Math.floor(Math.random() * (12000 - 9000) + 9000) : undefined, // Add oldPrice for item 5
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
