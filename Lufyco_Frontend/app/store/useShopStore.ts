import { create } from 'zustand';
import { mockProducts, mockCategories, Product, Category } from '../data/mockData';

export interface FilterState {
    query: string;
    categoryId?: string;
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
    selectedColors?: string[];
    selectedSizes?: string[];
    sortBy?: 'popular' | 'latest' | 'price_low' | 'price_high';
}

interface ShopState {
    products: Product[];
    categories: Category[];
    activeFilters: FilterState;

    setQuery: (q: string) => void;
    setCategory: (id?: string) => void;
    setFilter: (updates: Partial<FilterState>) => void;
    resetFilters: () => void;
    getFilteredProducts: () => Product[];
}

const initialFilters: FilterState = {
    query: '',
    categoryId: undefined,
    priceMin: undefined,
    priceMax: undefined,
    ratingMin: undefined,
    selectedColors: [],
    selectedSizes: [],
    sortBy: 'popular',
};

export const useShopStore = create<ShopState>((set, get) => ({
    products: mockProducts,
    categories: mockCategories,
    activeFilters: initialFilters,

    setQuery: (q) => set((state) => ({ activeFilters: { ...state.activeFilters, query: q } })),
    setCategory: (id) => set((state) => ({ activeFilters: { ...state.activeFilters, categoryId: id } })),
    setFilter: (updates) => set((state) => ({ activeFilters: { ...state.activeFilters, ...updates } })),

    resetFilters: () => set({ activeFilters: initialFilters }),

    getFilteredProducts: () => {
        const { products, activeFilters } = get();
        const { query, categoryId, priceMin, priceMax, ratingMin, sortBy } = activeFilters;

        let filtered = products.filter(p => {
            // Category
            if (categoryId && p.categoryId !== categoryId) return false;

            // Query
            if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) return false;

            // Price
            if (priceMin !== undefined && p.price < priceMin) return false;
            if (priceMax !== undefined && p.price > priceMax) return false;

            // Rating
            if (ratingMin !== undefined && p.rating < ratingMin) return false;

            return true;
        });

        // Sort
        if (sortBy === 'price_low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'latest') {
            // Mock latest by creating id desc or random
            filtered.sort((a, b) => b.id.localeCompare(a.id));
        }
        // 'popular' could be sort by reviews

        return filtered;
    }
}));
