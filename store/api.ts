// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api',
  credentials: 'include', // send cookies (JWT in httpOnly cookie)
  prepareHeaders: (headers, { getState }) => {
    // Optionally attach Authorization header from state if using Bearer token
    // const token = (getState() as RootState).auth.token;
    // if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ✅ Wrapper to handle refresh token automatically
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refreshing token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // Retry original query after refresh
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

// ✅ Create empty API for injection
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Dataset'], // scalable tagging
  endpoints: () => ({}),
});
