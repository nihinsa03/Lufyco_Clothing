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
}

import { MOCK_PRODUCTS } from './mockProducts';

export const mockCategories: Category[] = [
    // Men's Wear
    { id: 'cat_shirts', name: 'Shirts', image: require('../../assets/images/categories/slider/04fe340acd523c96e4b87b737025cd247b5d017c.jpg'), gender: 'men' },
    { id: 'cat_jeans', name: 'Jeans', image: require('../../assets/images/categories/slider/05c9711004c6f4da74eb15af868997e2bdb58ae5.jpg'), gender: 'men' },
    { id: 'cat_tshirts', name: 'Tshirts', image: require('../../assets/images/categories/slider/07572d8e02d35791d9962d504da494499c441fb7.jpg'), gender: 'men' },
    { id: 'cat_casual_shoes', name: 'Casual Shoes', image: require('../../assets/images/categories/slider/09def1d916fe746ed3f38b20f41819dab58082bc.jpg'), gender: 'men' },
    { id: 'cat_sweater', name: 'Sweater', image: require('../../assets/images/categories/slider/15e8c54d665ab5d7a9b9f08c82346e325cbb25c2.jpg'), gender: 'men' },
    { id: 'cat_sports_shoes', name: 'Sports Shoes', image: require('../../assets/images/categories/slider/1d9b8dd4a416ce614faab38f891d281f6e532126.jpg'), gender: 'men' },
    // Women's Wear
    { id: 'cat_dresses', name: 'Dresses', image: require('../../assets/images/categories/slider/311587e98c5efb88441122001d2f6738b645619f.jpg'), gender: 'women' },
    { id: 'cat_tops', name: 'Tops', image: require('../../assets/images/categories/slider/31f5266ad24c335037af08e454c2424a04e92c7d.jpg'), gender: 'women' },
    { id: 'cat_trousers', name: 'Trousers', image: require('../../assets/images/categories/slider/3951a442a4ea6e63223e1ee2cdc9b34973609a5d.jpg'), gender: 'men' },
    { id: 'cat_heels', name: 'Heels', image: require('../../assets/images/categories/slider/3ad65b4cfff8090b556cc65fce8b38fef31a006d.jpg'), gender: 'women' },
    { id: 'cat_jackets', name: 'Jackets', image: require('../../assets/images/categories/slider/5645f86a3ff80a18e2d25c95aad6b483b49898eb.jpg'), gender: 'men' },
    { id: 'cat_kurtas', name: 'Kurtas', image: require('../../assets/images/categories/slider/59c73eab9bcbe2e8211cd8492e255b1648b9ca56.jpg'), gender: 'women' },
    // Beauty Products
    { id: 'cat_skincare', name: 'Skincare', image: require('../../assets/images/categories/slider/6965191e30839eb806a7abcdba649144dce48cfb.jpg'), gender: 'unisex' },
    { id: 'cat_makeup', name: 'Makeup', image: require('../../assets/images/categories/slider/6dda88270fbd2356cb5641cd2eeec16985e050ce.jpg'), gender: 'unisex' },
    { id: 'cat_haircare', name: 'Hair Care', image: require('../../assets/images/categories/slider/72509a3291dfd35cafdd16f84756f8410ff2f7b4.jpg'), gender: 'unisex' },
    { id: 'cat_nailpolish', name: 'Nail Polish', image: require('../../assets/images/categories/slider/7d61dfe3bc42cf95acbcdd69e23f7faeaa1a095d.jpg'), gender: 'unisex' },
    { id: 'cat_perfume', name: 'Perfume', image: require('../../assets/images/categories/slider/8af8744f363932525f353481160f4e8081141e85.jpg'), gender: 'unisex' },
    // Jewellery
    { id: 'cat_necklaces', name: 'Necklaces', image: require('../../assets/images/categories/slider/ab085782f6ff19bf0c162f1d2d56ff3f996cc3fb.jpg'), gender: 'unisex' },
    { id: 'cat_rings', name: 'Rings', image: require('../../assets/images/categories/slider/b0ac050aae360d1dc7488d758203d881ad4cae10.jpg'), gender: 'unisex' },
    { id: 'cat_earrings', name: 'Earrings', image: require('../../assets/images/categories/slider/b9d03bdf60b3955da1b46ef3dbf3bddabef81ca2.jpg'), gender: 'unisex' },
    { id: 'cat_bracelets', name: 'Bracelets', image: require('../../assets/images/categories/slider/c0429b5f29cd3938114ed844ad1865f353913222.jpg'), gender: 'unisex' },
    // Accessories
    { id: 'cat_handbags', name: 'Handbags', image: require('../../assets/images/categories/slider/e2d17b6710122d9553e31ff65a855e9c123c54f9.jpg'), gender: 'unisex' },
    { id: 'cat_watches', name: 'Watches', image: require('../../assets/images/categories/slider/e879cbcdd3aa29a38efcbc25ec29a7dc91c989ca.jpg'), gender: 'unisex' },
    { id: 'cat_belts', name: 'Belts', image: require('../../assets/images/categories/slider/f3786016c4528daf0fe0b783dc7b0fce5b80f47e.jpg'), gender: 'unisex' },
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
