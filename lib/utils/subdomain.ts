/**
 * Extract workspace slug from hostname
 * Supports:
 * - Development: acme.localhost:3000 -> acme
 * - Production: acme.app.com -> acme
 */
export function extractWorkspaceSlug(hostname: string): string | null {
  const parts = hostname.split('.');
  
  // Handle localhost development
  if (hostname.includes('localhost')) {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      return subdomain;
    }
    return null;
  }
  
  // Handle production: acme.app.com
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

/**
 * Get workspace subdomain URL
 */
export function getWorkspaceUrl(slug: string, path = ''): string {
  if (typeof window === 'undefined') return '';
  
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  if (hostname.includes('localhost')) {
    return `${protocol}//${slug}.localhost${port}${path}`;
  }
  
  // Production: replace subdomain
  const domainParts = hostname.split('.');
  if (domainParts.length > 1) {
    const baseDomain = domainParts.slice(1).join('.');
    return `${protocol}//${slug}.${baseDomain}${path}`;
  }
  
  return `${protocol}//${slug}.${hostname}${path}`;
}

/**
 * Check if current route is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/login', '/register', '/verify-email', '/select-workspace'];
  return publicRoutes.some((route) => pathname.startsWith(route));
}
