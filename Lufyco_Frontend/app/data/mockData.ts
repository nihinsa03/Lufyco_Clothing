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

// Transform MOCK_PRODUCTS to match local Product interface
const transformedNewProducts: Product[] = MOCK_PRODUCTS.map(p => ({
    id: p._id,
    title: p.name,
    price: p.price,
    rating: 4.5,
    reviews: p.reviewsCount || 0,
    images: [p.image], // Wrap single image string in array
    categoryId: getCatId(p.category || 'Men'),
    tags: [p.category || '', p.subCategory || '', p.type || ''].filter(Boolean),
    colors: p.colors || [],
    sizes: p.sizes || [],
    isNewArrival: true, // Mark all as new for visibility
    description: p.description
}));

export const mockProducts: Product[] = [
    ...transformedNewProducts,
    {
        id: 'old_p1',
        title: 'Classic White Shirt',
        price: 29.99,
        rating: 4.5,
        reviews: 120,
        images: [require('../../assets/images/categories/men/shirts.png')],
        categoryId: 'c1',
        tags: ['shirt', 'formal', 'men'],
        colors: ['#FFFFFF', '#000000'],
        sizes: ['S', 'M', 'L', 'XL'],
        isNewArrival: true,
        isPopular: true,
    },
    {
        id: 'p2',
        title: 'Summer Floral Dress',
        price: 49.99,
        oldPrice: 69.99,
        rating: 4.8,
        reviews: 85,
        images: [require('../../assets/images/categories/women/dresses.jpg')],
        categoryId: 'c2',
        tags: ['dress', 'summer', 'women'],
        colors: ['#FFC0CB', '#FFFFFF'],
        sizes: ['XS', 'S', 'M'],
        isExclusive: true,
        isPriceDropping: true,
        discountPercent: 28,
    },
    {
        id: 'p3',
        title: 'Running Shoes',
        price: 89.99,
        rating: 4.2,
        reviews: 200,
        images: [require('../../assets/images/categories/men/sports-shoes.jpg')],
        categoryId: 'c4',
        tags: ['shoes', 'sports', 'running'],
        colors: ['#0000FF', '#000000'],
        sizes: ['8', '9', '10', '11'],
        isNewArrival: true,
    },
    {
        id: 'p4',
        title: 'Leather Watch',
        price: 120.00,
        oldPrice: 150.00,
        rating: 4.9,
        reviews: 40,
        images: [require('../../assets/images/categories/men/watches.jpg')],
        categoryId: 'c5',
        tags: ['watch', 'accessories', 'luxury'],
        colors: ['#8B4513'],
        sizes: ['One Size'],
        isExclusive: true,
    },
    // Generate more dummies
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen_${i}`,
        title: `Product ${i + 1}`,
        price: 20 + i * 5,
        oldPrice: i % 3 === 0 ? (20 + i * 5) * 1.2 : undefined,
        rating: 3 + (i % 20) / 10,
        reviews: 10 + i,
        images: [{ uri: `https://via.placeholder.com/300?text=Product+${i + 1}` }],
        categoryId: i % 2 === 0 ? 'c1' : 'c2',
        tags: ['casual'],
        colors: ['#000000', '#FF0000', '#00FF00'],
        sizes: ['M', 'L'],
        isNewArrival: i < 5,
        isPopular: i > 10 && i < 15,
        isPriceDropping: i % 4 === 0,
        discountPercent: i % 3 === 0 ? 20 : undefined,
    }))
];
