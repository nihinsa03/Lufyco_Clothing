import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProducts, mockCategories, Product, Category } from '../data/mockData';

export interface FilterState {
    query: string;

    // Checkbox filters
    newArrivals: boolean;
    popularThisWeek: boolean;
    priceDropping: boolean;
    discountOnly: boolean;
    popularity: boolean;

    // Explicit filters (kept if needed)
    priceMin?: number;
    priceMax?: number;
    categoryId?: string;
}

interface ShopState {
    products: Product[];
    categories: Category[];

    activeFilters: FilterState;
    recentSearches: string[];

    setQuery: (q: string) => void;
    toggleFilter: (key: keyof FilterState) => void;
    setFilter: (updates: Partial<FilterState>) => void;
    resetFilters: () => void;
    addRecentSearch: (term: string) => void;
    clearRecentSearches: () => void;

    getFilteredProducts: () => Product[];
    getSaleProducts: () => Product[];
}

const initialFilters: FilterState = {
    query: '',
    newArrivals: false,
    popularThisWeek: false,
    priceDropping: false,
    discountOnly: false,
    popularity: false,

    priceMin: undefined,
    priceMax: undefined,
    categoryId: undefined,
};

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            products: mockProducts,
            categories: mockCategories,
            activeFilters: initialFilters,
            recentSearches: [],

            setQuery: (q) => set((state) => ({
                activeFilters: { ...state.activeFilters, query: q }
            })),

            toggleFilter: (key) => set((state) => {
                const val = state.activeFilters[key];
                if (typeof val === 'boolean') {
                    return { activeFilters: { ...state.activeFilters, [key]: !val } };
                }
                return state;
            }),

            setFilter: (updates) => set((state) => ({
                activeFilters: { ...state.activeFilters, ...updates }
            })),

            resetFilters: () => set({ activeFilters: initialFilters }),

            addRecentSearch: (term) => set((state) => {
                if (!term.trim()) return state;
                const newRecent = [term, ...state.recentSearches.filter(t => t !== term)].slice(0, 8);
                return { recentSearches: newRecent };
            }),

            clearRecentSearches: () => set({ recentSearches: [] }),

            getFilteredProducts: () => {
                const { products, activeFilters } = get();
                const {
                    query, categoryId, priceMin, priceMax,
                    newArrivals, popularThisWeek, priceDropping, discountOnly, popularity
                } = activeFilters;

                let filtered = products.filter(p => {
                    // Category
                    if (categoryId && p.categoryId !== categoryId) return false;

                    // Query
                    if (query) {
                        const q = query.toLowerCase();
                        if (!p.title.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) {
                            return false;
                        }
                    }

                    // Price Range
                    if (priceMin !== undefined && p.price < priceMin) return false;
                    if (priceMax !== undefined && p.price > priceMax) return false;

                    // Checkbox flags
                    if (newArrivals && !p.isNewArrival) return false;
                    if (popularThisWeek && !p.isPopular) return false;
                    if (priceDropping && !p.isPriceDropping) return false;
                    if (discountOnly && (!p.oldPrice || p.oldPrice <= p.price)) return false;

                    return true;
                });

                // Sorting
                if (popularity) {
                    filtered.sort((a, b) => b.reviews - a.reviews); // Mock popularity by reviews
                }

                return filtered;
            },

            getSaleProducts: () => {
                const { products } = get();
                return products.filter(p => p.oldPrice && p.oldPrice > p.price);
            }
        }),
        {
            name: 'shop-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                activeFilters: state.activeFilters,
                recentSearches: state.recentSearches
            }),
        }
    )
);
