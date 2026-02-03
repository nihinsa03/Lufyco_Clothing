import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import apiClient from '../api/apiClient';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    autoAlert?: boolean; // Automatically show alert on error (default true)
}

export const useApi = <T = any>() => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async (
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        url: string,
        payload?: any,
        options: UseApiOptions = { autoAlert: true }
    ) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const isGet = method === 'GET';
            const response = await apiClient({
                method,
                url,
                data: isGet ? undefined : payload,
                params: isGet ? payload : undefined,
            });

            const result = response.data;
            setData(result);
            if (options.onSuccess) options.onSuccess(result);
            return result;
        } catch (err: any) {
            const msg = err.message || 'An unexpected error occurred';
            setError(msg);

            if (options.onError) {
                options.onError(err);
            }

            // Show alert by default unless explicitly disabled
            if (options.autoAlert !== false) {
                Alert.alert('Error', msg);
            }

            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = (url: string, params?: any, options?: UseApiOptions) => request('GET', url, params, options);
    const post = (url: string, body: any, options?: UseApiOptions) => request('POST', url, body, options);
    const put = (url: string, body: any, options?: UseApiOptions) => request('PUT', url, body, options);
    const del = (url: string, options?: UseApiOptions) => request('DELETE', url, undefined, options);

    return {
        data,
        loading,
        error,
        request,
        get,
        post,
        put,
        del,
        reset: () => {
            setData(null);
            setError(null);
            setLoading(false);
        }
    };
};
