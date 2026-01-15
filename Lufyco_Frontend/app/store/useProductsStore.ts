import { create } from 'zustand';

export type Product = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    description: string;
    images: any[];
    sizes: string[];
    colors: string[]; // hex codes
    rating: number;
    reviews: number;
};

// Mock Data
const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        title: "Sunset Bloom Wrap Top",
        price: 36.25,
        oldPrice: 42.00,
        description: "Add a touch of effortless elegance to your wardrobe with our Sunset Bloom Wrap Top. Featuring a stunning floral print on a vibrant burnt-orange background.",
        images: [
            require("../../assets/images/categories/women/tops.jpg"), // Placeholder
            require("../../assets/images/categories/women/dresses.jpg"),
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["#222222", "#D2691E", "#4169E1", "#800080", "#FFC0CB"],
        rating: 4.8,
        reviews: 124,
    },
    {
        id: "p2",
        title: "Leathers Black Round Perfume",
        price: 85.00,
        description: "A premium fragrance with notes of cedarwood and leather.",
        images: [
            require("../../assets/images/categories/men/perfume.jpg"),
        ],
        sizes: ["100ml", "50ml"],
        colors: [],
        rating: 4.5,
        reviews: 40,
    },
    {
        id: "p3",
        title: "Blue Casual Shirt",
        price: 30.25,
        description: "Comfortable cotton blend shirt for casual outings.",
        images: [require("../../assets/images/men/casual/shirts.jpg")],
        sizes: ["S", "M", "L", "XL"],
        colors: ["#0000FF", "#FFFFFF"],
        rating: 4.2,
        reviews: 80,
    }
];

type ProductsState = {
    products: Product[];
    getProductById: (id: string) => Product | undefined;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
    products: MOCK_PRODUCTS,
    getProductById: (id) => MOCK_PRODUCTS.find(p => p.id === id)
}));
