import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, PaymentMethod } from './useCheckoutStore';

export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    qty: number;
    image: any;
    size?: string;
    color?: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered';
    items: OrderItem[];
    address: Address;
    payment: PaymentMethod;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
}

interface OrdersState {
    orders: Order[];
    addOrder: (order: Order) => void;
    getOrderById: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
            getOrderById: (id) => get().orders.find((o) => o.id === id),
        }),
        {
            name: 'orders-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
