/**
 * Base API Client configured for ngrok & remote REST APIs
 */

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(
  endpoint: string,
  method: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');

  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is missing. Please restart your Expo server with "npx expo start -c" to reload your .env file.'
    );
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Bypass ngrok's free-tier anti-abuse warning interstitial
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Parse response
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      if (typeof data === 'object' && data !== null) {
        const errorObj = data as Record<string, any>;
        if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.error) {
          errorMessage = typeof errorObj.error === 'string' ? errorObj.error : JSON.stringify(errorObj.error);
        }
      } else if (typeof data === 'string' && data.trim()) {
        const isHtml = /<[a-z][\s\S]*>/i.test(data);
        if (!isHtml) {
          errorMessage = data.trim();
        } else if (response.status === 404) {
          errorMessage = 'API server or ngrok tunnel not found (404). Please verify your API URL.';
        } else if (response.status === 502 || response.status === 503) {
          errorMessage = 'Backend server unreachable (502/503). Please verify Laragon / Apache is running.';
        }
      }

      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    // Only log unexpected server crashes (500+) or network failures, not expected 4xx user validation errors
    if (!error.status || error.status >= 500) {
      console.warn(`[API Server Error] ${method} ${url}:`, error.message || error);
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, 'GET', undefined, options),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, 'POST', body, options),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, 'PUT', body, options),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, 'PATCH', body, options),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, 'DELETE', undefined, options),
};

export default api;

