// Redirect delays
export const REDIRECT_DELAYS = {
  ERROR: 2000,
  SUCCESS: 1000,
  LOGOUT: 150,
} as const;

// Token expiration check
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return false; // No expiration means token doesn't expire
    return exp * 1000 < Date.now();
  } catch {
    return true; // Invalid token format
  }
};

