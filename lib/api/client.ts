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

    // Request interceptor to add auth token and workspace context
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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

    // Response interceptor for token refresh
      this.client.interceptors.response.use(
          (response) => response,
          async (error) => {
              const originalRequest = error.config;

              // If 401, just clear auth and redirect to login
              if (error.response?.status === 401) {
                  this.clearAuth();
                  if (typeof window !== 'undefined') {
                      window.location.href = '/login';
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

  private getWorkspaceSlug(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Extract from subdomain
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // For localhost:3000, check if it's a subdomain pattern
    if (hostname.includes('localhost')) {
      // In development, you might use a different pattern
      // e.g., acme.localhost:3000
      const subdomain = parts[0];
      if (subdomain !== 'localhost' && subdomain !== 'www') {
        return subdomain;
      }
    } else {
      // Production: acme.app.com -> acme
      if (parts.length > 2) {
        return parts[0];
      }
    }

    // Fallback to stored workspace slug
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