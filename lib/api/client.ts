import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

class ApiClient {
    private client: AxiosInstance;
    private workspaceSlug: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token, refresh token, and workspace context
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add refresh token in header for backend auto-refresh
                const refreshToken = this.getRefreshToken();
                if (refreshToken && config.headers) {
                    config.headers['x-refresh-token'] = refreshToken;
                }

                // Add workspace context from subdomain or header
                const workspaceSlug = this.getWorkspaceSlug();
                if (workspaceSlug && config.headers) {
                    config.headers['x-workspace-slug'] = workspaceSlug;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to extract new access token and handle errors
        this.client.interceptors.response.use(
            (response) => {
                // Extract new access token if backend auto-refreshed it
                const newAccessToken =
                    response.headers['x-new-access-token'] ||
                    response.headers['x-access-token'] ||
                    response.data?.accessToken ||
                    response.data?.data?.accessToken;

                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                }

                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // If 401, check if refresh token expired
                if (error.response?.status === 401) {
                    const refreshTokenExpired =
                        error.response?.data?.refreshTokenExpired ||
                        error.response?.data?.message?.toLowerCase().includes('refresh token');

                    if (refreshTokenExpired) {
                        this.clearAuth();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refreshToken');
    }

    private getWorkspaceSlug(): string | null {
        if (typeof window === 'undefined') return null;

        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        if (hostname.includes('localhost')) {
            const subdomain = parts[0];
            if (subdomain !== 'localhost' && subdomain !== 'www') {
                return subdomain;
            }
        } else {
            if (parts.length > 2) {
                return parts[0];
            }
        }

        return localStorage.getItem('workspaceSlug');
    }

    private clearAuth(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('workspaceSlug');
    }

    setWorkspaceSlug(slug: string | null): void {
        this.workspaceSlug = slug;
        if (slug) {
            localStorage.setItem('workspaceSlug', slug);
        } else {
            localStorage.removeItem('workspaceSlug');
        }
    }

    get instance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient();