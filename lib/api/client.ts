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

                // Check if this route should use subdomain
                const shouldUseSubdomain = this.shouldUseSubdomain(config.url || '');

                if (shouldUseSubdomain) {
                    // Build baseURL with workspace slug as subdomain
                    const workspaceSlug = this.getWorkspaceSlug();
                    if (workspaceSlug) {
                        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                        const url = new URL(baseApiUrl);

                        if (url.hostname === 'localhost' || url.hostname.includes('localhost')) {
                            // Development: nerdy-developers.localhost:8000
                            config.baseURL = `${url.protocol}//${workspaceSlug}.localhost${url.port ? `:${url.port}` : ''}${url.pathname}`;
                        } else {
                            // Production: nerdy-developers.yourdomain.com
                            const hostParts = url.hostname.split('.');
                            const rootDomain = hostParts.slice(-2).join('.');
                            config.baseURL = `${url.protocol}//${workspaceSlug}.${rootDomain}${url.port ? `:${url.port}` : ''}${url.pathname}`;
                        }
                    } else {
                        // No workspace slug, use original baseURL
                        config.baseURL = process.env.NEXT_PUBLIC_API_URL;
                    }
                } else {
                    // Route doesn't need subdomain, use original baseURL
                    config.baseURL = process.env.NEXT_PUBLIC_API_URL;
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

    /**
     * Check if a route should use subdomain-based URL
     * Returns false for public routes and workspace-optional routes
     */
    private shouldUseSubdomain(url: string): boolean {
        const normalizedUrl = url.split('?')[0];

        // Public routes - no subdomain needed
        const publicPatterns = [
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/request-password-reset',
            '/api/auth/password-reset',
            '/api/payment/paystack/webhook',
            '/api/invitations/accept',
            '/api/docs',
        ];

        // Workspace-optional routes - no subdomain needed
        const workspaceOptionalPatterns = [
            '/api/workspaces',
            '/api/users',
            '/api/auth/',
            '/api/invitations/accept',
            '/api/channels/invitations/accept',
            '/api/docs',
        ];

        // Check public routes
        if (publicPatterns.some(pattern => normalizedUrl.startsWith(pattern))) {
            return false;
        }

        // Check workspace-optional routes
        if (workspaceOptionalPatterns.some(pattern => normalizedUrl.startsWith(pattern))) {
            return false;
        }

        // All other routes (like /api/channels, /api/messages, etc.) use subdomain
        return true;
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