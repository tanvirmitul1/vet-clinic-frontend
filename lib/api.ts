// lib/api.ts
export const API_URL = 'http://127.0.0.1:8000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export const AuthAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  profile: (token: string) => apiRequest('/auth/user-profile', {}, token),

  logout: (token: string) => apiRequest('/auth/logout', { method: 'POST' }, token),
};
