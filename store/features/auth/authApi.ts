import { api } from '@/store/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      { message: string; user: { id: number; name: string; email: string } },
      { name: string; email: string; password: string; password_confirmation: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<{ message: string }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    profile: builder.query<
      { success: boolean; user: { id: number; name: string; email: string } },
      void
    >({
      query: () => '/auth/me',
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    refresh: builder.mutation<
      { access_token: string; token_type: string; expires_in: number },
      void
    >({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useProfileQuery,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
