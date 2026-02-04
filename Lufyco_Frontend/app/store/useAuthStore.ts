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
    verifyEmail: (email: string, otp: string) => Promise<boolean>;
    resendOTP: (email: string) => Promise<boolean>;
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
                    // Backend now sends: { message, email, userId }
                    // Don't auto-login, just return success
                    console.log('Signup successful:', res.data.message);
                    set({ loading: false });
                    return true;
                } catch (e: any) {
                    const msg = e.response?.data?.message || "Signup Failed";
                    console.error("Signup Store Error:", msg, e);
                    set({ error: msg, loading: false });
                    return false;
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
                        verified: userData.isVerified || true,
                        isAdmin: userData.isAdmin
                    };

                    // Save token if backend returns it
                    if (userData.token) {
                        // api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                    }

                    set({ user: appUser, token: userData.token || 'mock_token', isAuthenticated: true });
                    return true;
                } catch (e: any) {
                    const msg = e.response?.data?.message || "Login Failed";
                    console.error("Login Store Error:", msg, e);
                    set({ error: msg });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            verifyEmail: async (email: string, otp: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/users/verify-email', { email, otp });
                    console.log('Email verified successfully:', res.data.message);

                    // Update user verification status
                    const userData = res.data.user;
                    if (userData) {
                        const appUser = {
                            id: userData._id,
                            name: userData.name,
                            email: userData.email,
                            verified: userData.isVerified
                        };
                        set({ user: appUser });
                    }

                    set({ loading: false });
                    return true;
                } catch (e: any) {
                    const msg = e.response?.data?.message || "Verification Failed";
                    console.error("Verify Email Error:", msg, e);
                    set({ error: msg, loading: false });
                    return false;
                }
            },

            resendOTP: async (email: string) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/users/resend-otp', { email });
                    console.log('OTP resent successfully:', res.data.message);
                    set({ loading: false });
                    return true;
                } catch (e: any) {
                    const msg = e.response?.data?.message || "Failed to resend OTP";
                    console.error("Resend OTP Error:", msg, e);
                    set({ error: msg, loading: false });
                    return false;
                }
            },

            verifyOtp: async (otp) => {
                set({ loading: true, error: null });
                try {
                    // Legacy method - keeping for backward compatibility
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if (otp !== '123456') throw new Error('Invalid Code');

                    const { user } = get();
                    if (user) {
                        set({ user: { ...user, verified: true }, token: 'mock_token_verified', isAuthenticated: true });
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
