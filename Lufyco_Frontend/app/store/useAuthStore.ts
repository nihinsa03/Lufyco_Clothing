import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import api from '../api/api';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    verified: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isOnboarded: boolean;
    loading: boolean;
    error: string | null;

    completeOnboarding: () => void;
    signup: (data: any) => Promise<boolean>;
    login: (data: any) => Promise<boolean>;
    verifyOtp: (otp: string) => Promise<boolean>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<boolean>;
    resetPassword: (password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isOnboarded: false,
            loading: false,
            error: null,

            completeOnboarding: () => set({ isOnboarded: true }),

            signup: async (data) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/users/register', data);
                    // Backend returns: { _id, name, email, token, isAdmin }
                    // We can choose to auto-login or redirect to login.
                    // Current flow is redirect to login, so we just return true.

                    return true;
                } catch (e: any) {
                    const msg = e.response?.data?.message || "Signup Failed";
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            login: async ({ email, password }) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/users/login', { email, password });
                    const userData = res.data;

                    const appUser = {
                        id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        verified: true,
                        isAdmin: userData.isAdmin
                    };

                    // Store token for future requests
                    if (userData.token) {
                        // api defaults are handled by interceptor in api.js usually, 
                        // but we need to ensure AsyncStorage has it for persistence if we use that.
                        // useAuthStore uses 'persist' so 'token' state will be saved.
                    }

                    set({ user: appUser, token: userData.token, isAuthenticated: true });
                    return true;
                } catch (e: any) {
                    set({ error: e.response?.data?.message || "Login Failed" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            verifyOtp: async (otp) => {
                // Feature not implemented in backend yet.
                // Simulating success for UI flow completeness if user hits this screen.
                set({ loading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    if (otp !== '123456') throw new Error('Invalid Code (Simulated)');

                    const { user } = get();
                    if (user) {
                        set({ user: { ...user, verified: true } });
                    }
                    return true;
                } catch (e: any) {
                    set({ error: e.message });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            requestPasswordReset: async (email) => {
                set({ loading: true });
                // Mock send
                await new Promise(resolve => setTimeout(resolve, 1000));
                set({ loading: false });
                return true;
            },

            resetPassword: async (password) => {
                set({ loading: true });
                // Mock reset
                await new Promise(resolve => setTimeout(resolve, 1000));
                set({ loading: false });
                return true;
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                isOnboarded: state.isOnboarded
            }),
        }
    )
);
