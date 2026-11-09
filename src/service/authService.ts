import { api, setAuthToken } from './apiClient';
import { storage } from './storage';

export type User = {
  id: number;
  name: string;
  email: string;
  img_profile?: string | null;
};

export type AuthResponse = {
  message: string;
  user: User;
  token: string;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/login', {
      email,
      password,
    });
    setAuthToken(response.token);
    await storage.set(TOKEN_KEY, response.token);
    await storage.set(USER_KEY, JSON.stringify(response.user));
    return response;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/register', {
      name,
      email,
      password,
    });
    setAuthToken(response.token);
    await storage.set(TOKEN_KEY, response.token);
    await storage.set(USER_KEY, JSON.stringify(response.user));
    return response;
  },

  getUser: async (): Promise<{ user: User }> => {
    return api.get<{ user: User }>('/api/user');
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      return await api.post<{ message: string }>('/api/logout');
    } catch {
      return { message: 'Logged out locally' };
    } finally {
      setAuthToken(null);
      await storage.delete(TOKEN_KEY);
      await storage.delete(USER_KEY);
    }
  },

  getStoredSession: async (): Promise<{ token: string | null; user: User | null }> => {
    try {
      const token = await storage.get(TOKEN_KEY);
      const userRaw = await storage.get(USER_KEY);
      const user = userRaw ? (JSON.parse(userRaw) as User) : null;

      if (token) {
        setAuthToken(token);
      }
      return { token, user };
    } catch (e) {
      console.warn('[authService] Error restoring session:', e);
      return { token: null, user: null };
    }
  },
};

export default authService;
