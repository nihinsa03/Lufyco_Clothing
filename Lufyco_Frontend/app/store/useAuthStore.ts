import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

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
                    // Mock API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Create unverified user
                    const mockUser = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        verified: false
                    };

                    // We don't set user/token yet, wait for OTP. 
                    // But for this flow we store temp user to be verified?
                    // Or we can just set user but isAuthenticated = false logic?
                    // Let's store user but keep isAuthenticated false until verify.
                    set({ user: mockUser });

                    // console.log("OTP: 123456");
                    return true;
                } catch (e) {
                    set({ error: "Signup Failed" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            login: async ({ email, password }) => {
                set({ loading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // Mock login - accept any for now or specific
                    if (email === 'fail@test.com') throw new Error('Invalid credentials');

                    const mockUser = {
                        id: 'u_123',
                        name: 'Mano D',
                        email: email,
                        verified: true
                    };

                    set({ user: mockUser, token: 'mock_token', isAuthenticated: true });
                    return true;
                } catch (e: any) {
                    set({ error: e.message || "Login Failed" });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            verifyOtp: async (otp) => {
                set({ loading: true, error: null });
                try {
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
