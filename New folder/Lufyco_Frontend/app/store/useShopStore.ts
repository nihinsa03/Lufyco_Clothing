import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProducts, mockCategories, Product, Category } from '../data/mockData';
import api from '../api/api';

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

    // Sorting
    priceLowToHigh?: boolean;
    priceHighToLow?: boolean;
}

interface ShopState {
    products: Product[];
    categories: Category[];
    productsLoaded: boolean;

    activeFilters: FilterState;
    recentSearches: string[];

    setQuery: (q: string) => void;
    toggleFilter: (key: keyof FilterState) => void;
    setFilter: (updates: Partial<FilterState>) => void;
    resetFilters: () => void;
    addRecentSearch: (term: string) => void;
    clearRecentSearches: () => void;
    fetchProducts: () => Promise<void>;

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
    priceLowToHigh: false,
    priceHighToLow: false,

    priceMin: undefined,
    priceMax: undefined,
    categoryId: undefined,
};

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            products: mockProducts,
            categories: mockCategories,
            productsLoaded: false,
            activeFilters: initialFilters,
            recentSearches: [],

            fetchProducts: async () => {
                try {
                    const [productsRes, categoriesRes] = await Promise.all([
                        api.get('/products'),
                        api.get('/products/categories'),
                    ]);
                    const fetchedProducts: Product[] = productsRes.data?.products || productsRes.data || [];
                    const fetchedCategories: Category[] = categoriesRes.data?.categories || categoriesRes.data || [];
                    if (fetchedProducts.length > 0) {
                        set({ products: fetchedProducts, productsLoaded: true });
                    }
                    if (fetchedCategories.length > 0) {
                      const categoryOrder = [
                        "Men",
                        "Women",
                        "Kids",
                        "Unisex",
                        "Shoes",
                        "Jewellery",
                        "Accessories",
                        "Beauty",
                      ];

                      const sortedCategories = fetchedCategories.sort(
                        (a, b) => {
                          const indexA = categoryOrder.indexOf(a.name);
                          const indexB = categoryOrder.indexOf(b.name);

                          // If both are not in the list → keep original order
                          if (indexA === -1 && indexB === -1) return 0;

                          // If only A is not in list → move A to end
                          if (indexA === -1) return 1;

                          // If only B is not in list → move B to end
                          if (indexB === -1) return -1;

                          // Both exist in list → sort by predefined order
                          return indexA - indexB;
                        },
                      );

                      set({ categories: sortedCategories });
                    }
                } catch (err) {
                    // Silently fall back to mockData — app still works offline
                    console.warn('[ShopStore] Failed to fetch products from API, using mock data.', err);
                }
            },
            setQuery: (q) => set((state) => ({
                activeFilters: { ...state.activeFilters, query: q }
            })),

            toggleFilter: (key) => set((state) => {
                const val = state.activeFilters[key];

                // Handle basic booleans
                if (typeof val === 'boolean') {
                    let nextFilters = { ...state.activeFilters, [key]: !val };

                    // Enforce mutual exclusivity for sorts
                    if (key === 'priceLowToHigh' && !val) {
                        nextFilters.priceHighToLow = false;
                        nextFilters.popularity = false;
                    }
                    if (key === 'priceHighToLow' && !val) {
                        nextFilters.priceLowToHigh = false;
                        nextFilters.popularity = false;
                    }
                    if (key === 'popularity' && !val) {
                        nextFilters.priceLowToHigh = false;
                        nextFilters.priceHighToLow = false;
                    }

                    return { activeFilters: nextFilters };
                }
                return state;
            }),

            setFilter: (updates) => set((state) => ({
                activeFilters: { ...state.activeFilters, ...updates }
            })),

            resetFilters: () => set((state) => ({ 
                activeFilters: { 
                    ...initialFilters, 
                    categoryId: state.activeFilters.categoryId, 
                    query: state.activeFilters.query 
                } 
            })),

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
                if (activeFilters.priceLowToHigh) {
                    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                } else if (activeFilters.priceHighToLow) {
                    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                } else if (popularity) {
                    filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
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
