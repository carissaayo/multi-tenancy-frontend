import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

class ApiClient {
    private client: AxiosInstance;
    private workspaceSlug: string | null = null;
    private refreshTokenPromise: Promise<string | null> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor to add auth tokens and workspace context
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers) {
                    config.headers = {} as any;
                }

                // Reset to original baseURL
                config.baseURL = process.env.NEXT_PUBLIC_API_URL;

                // Add access token
                const token = this.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add refresh token (backend expects lowercase 'refreshtoken')
                const refreshToken = this.getRefreshToken();
                if (refreshToken) {
                    config.headers['refreshtoken'] = refreshToken;
                }

                // Normalize URL
                const requestUrl = config.url || '';
                const normalizedUrl = this.normalizeUrl(requestUrl);

                // Check if route needs subdomain
                const shouldUseSubdomain = this.shouldUseSubdomain(normalizedUrl);

                if (shouldUseSubdomain) {
                    const workspaceSlug = this.getWorkspaceSlug();
                    if (workspaceSlug) {
                        config.baseURL = this.buildSubdomainUrl(workspaceSlug);
                    } else {
                        console.error(`❌ Workspace-scoped route ${normalizedUrl} called without workspace slug!`);
                    }
                }

                // Debug logging
                console.log('🔍 API Request:', {
                    url: normalizedUrl,
                    baseURL: config.baseURL,
                    hasToken: !!token,
                    hasRefreshToken: !!refreshToken,
                    usesSubdomain: shouldUseSubdomain,
                    workspace: this.getWorkspaceSlug()
                });

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle token rotation and errors
        this.client.interceptors.response.use(
            (response) => {
                // Extract new tokens from response body (token rotation)
                const newAccessToken = response.data?.accessToken;
                const newRefreshToken = response.data?.refreshToken;

                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    console.log('✅ New access token stored');
                }

                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                    console.log('✅ New refresh token stored');
                }

                // Check for token in headers (middleware auto-refresh)
                const headerToken = response.headers['x-new-access-token'];
                if (headerToken) {
                    localStorage.setItem('accessToken', headerToken);
                    console.log('✅ Access token from header stored');
                }

                return response;
            },
            async (error: AxiosError) => {
                const originalRequest: any = error.config;

                // Prevent infinite retry loops
                if (originalRequest?._retry) {
                    console.error('❌ Retry failed, logging out');
                    this.clearAuth();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }

                // Handle 401 Unauthorized
                if (error.response?.status === 401) {
                    console.warn('⚠️ 401 Unauthorized - checking if refresh needed');

                    const message = (error.response?.data as any)?.message?.toLowerCase() || '';

                    // Check if refresh token is expired/invalid
                    if (message.includes('refresh token') || message.includes('token refresh failed')) {
                        console.error('❌ Refresh token expired or invalid - logging out');
                        this.clearAuth();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        return Promise.reject(error);
                    }

                    // Mark as retried
                    originalRequest._retry = true;

                    try {
                        // Backend auto-refreshes via middleware with refreshtoken header
                        // Just retry with current tokens from localStorage
                        const currentToken = this.getAccessToken();
                        const currentRefreshToken = this.getRefreshToken();

                        if (!currentToken || !currentRefreshToken) {
                            console.error('❌ No tokens available');
                            this.clearAuth();
                            if (typeof window !== 'undefined') {
                                window.location.href = '/login';
                            }
                            return Promise.reject(error);
                        }

                        // Update headers with current tokens
                        if (!originalRequest.headers) {
                            originalRequest.headers = {};
                        }

                        originalRequest.headers.Authorization = `Bearer ${currentToken}`;
                        originalRequest.headers['refreshtoken'] = currentRefreshToken;

                        console.log('🔄 Retrying request with current tokens');
                        return this.client(originalRequest);
                    } catch (retryError) {
                        console.error('❌ Retry failed:', retryError);
                        this.clearAuth();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        return Promise.reject(retryError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * Normalize URL to pathname without query params
     */
    private normalizeUrl(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            try {
                return new URL(url).pathname;
            } catch {
                return url;
            }
        }
        return url.split('?')[0].replace(/\/$/, '');
    }

    /**
     * Build subdomain URL for workspace-scoped routes
     */
    private buildSubdomainUrl(workspaceSlug: string): string {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const url = new URL(baseApiUrl);

        if (url.hostname === 'localhost' || url.hostname.includes('localhost')) {
            // Development: workspace-slug.localhost:8000
            return `${url.protocol}//${workspaceSlug}.localhost${url.port ? `:${url.port}` : ''}${url.pathname}`;
        } else {
            // Production: workspace-slug.yourdomain.com
            const hostParts = url.hostname.split('.');
            const rootDomain = hostParts.slice(-2).join('.');
            return `${url.protocol}//${workspaceSlug}.${rootDomain}${url.port ? `:${url.port}` : ''}${url.pathname}`;
        }
    }

    /**
     * Determines if a route requires workspace subdomain
     * Backend has TWO arrays:
     * 1. publicRoutes - No auth required (not relevant here, handled by backend)
     * 2. workspaceOptionalRoutes - Auth required but NO subdomain needed
     * 
     * Returns FALSE for workspaceOptionalRoutes, TRUE for workspace-scoped routes
     */
    private shouldUseSubdomain(url: string): boolean {
        // Prepend /api if not present (since baseURL includes /api)
        const fullPath = url.startsWith('/api') ? url : `/api${url}`;

        if (!fullPath.startsWith('/api')) {
            return false;
        }

        // Workspace-optional routes - authenticated but NO subdomain
        const workspaceOptionalPatterns = [
            '/api/workspaces',
            '/api/users',
            '/api/auth/',
            '/api/invitations/accept',
            '/api/channels/invitations/accept',
            '/api/docs',
        ];

        for (const pattern of workspaceOptionalPatterns) {
            // Exact match
            if (fullPath === pattern) {
                return false;
            }

            // Starts with pattern
            if (fullPath.startsWith(pattern)) {
                // Special case: /api/workspaces/:id (GET workspace by ID)
                if (pattern === '/api/workspaces' && fullPath.startsWith('/api/workspaces/')) {
                    const remaining = fullPath.substring('/api/workspaces/'.length);

                    // UUID pattern: 8-4-4-4-12 hex digits
                    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\/.*)?$/i;

                    if (uuidPattern.test(remaining)) {
                        return false; // /api/workspaces/:uuid is workspace-optional
                    }
                } else {
                    return false; // Other workspace-optional routes
                }
            }
        }

        // All other /api routes are workspace-scoped and need subdomain
        return true;
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

        // Priority 1: localStorage (most reliable)
        const storedSlug = localStorage.getItem('workspaceSlug');
        if (storedSlug) {
            return storedSlug;
        }

        // Priority 2: Extract from subdomain
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        // Development: workspace-slug.localhost
        if (hostname.includes('localhost')) {
            const subdomain = parts[0];
            if (subdomain !== 'localhost' && subdomain !== 'www') {
                return subdomain;
            }
        }
        // Production: workspace-slug.yourdomain.com
        else if (parts.length > 2) {
            const subdomain = parts[0];
            if (subdomain !== 'www') {
                return subdomain;
            }
        }

        return null;
    }

    private clearAuth(): void {
        console.log('🧹 Clearing authentication and redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('workspaceSlug');
    }

    setWorkspaceSlug(slug: string | null): void {
        this.workspaceSlug = slug;
        if (slug) {
            localStorage.setItem('workspaceSlug', slug);
            console.log(`✅ Workspace slug set: ${slug}`);
        } else {
            localStorage.removeItem('workspaceSlug');
            console.log('🧹 Workspace slug cleared');
        }
    }

    get instance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient();