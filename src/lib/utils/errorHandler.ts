export const parseApiError = (error: any): string => {
  if (typeof error === 'string') return error;

  // Normalized shape from client.ts interceptor: { success, status, message, errors }
  if (error.message && typeof error.status === 'number') return error.message;

  // Raw Axios shape (fallback, e.g. network errors before interceptor runs)
  if (error.response?.data?.message) return error.response.data.message;

  if (error.message) return error.message;

  return 'An unknown error occurred';
};

export const isAuthError = (error: any): boolean => {
  return error.status === 401 || error.status === 403 || error.response?.status === 401 || error.response?.status === 403;
};

export const isValidationError = (error: any): boolean => {
  return (error.status === 400 || error.response?.status === 400) && Array.isArray(error.errors || error.response?.data?.errors);
};

export const formatValidationErrors = (errors: any[]): Record<string, string> => {
  if (!Array.isArray(errors)) return {};
  
  const map: Record<string, string> = {};
  errors.forEach(err => {
    if (err.path && err.message) {
      // Zod error path is array, join it
      const field = Array.isArray(err.path) ? err.path.join('.') : err.path;
      map[field] = err.message;
    }
  });
  return map;
};
