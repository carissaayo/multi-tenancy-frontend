/**
 * Extract a user-friendly error message from API/axios errors.
 * Uses the custom message from response.data (not response.statusText).
 * Handles various backend error response shapes.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error) return fallback;

  // Prefer apiMessage attached by API client interceptor (from response.data)
  const withApiMessage = error as { apiMessage?: string };
  if (typeof withApiMessage.apiMessage === 'string' && withApiMessage.apiMessage.trim()) {
    return withApiMessage.apiMessage;
  }

  // Axios error - extract from response.data
  const axiosError = error as {
    response?: { data?: { message?: string; error?: string | string[] } };
    message?: string;
  };

  const msg = axiosError.response?.data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;

  const err = axiosError.response?.data?.error;
  if (typeof err === 'string' && err.trim()) return err;
  if (Array.isArray(err) && err.length > 0 && typeof err[0] === 'string') return err[0];

  // Generic Error
  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
