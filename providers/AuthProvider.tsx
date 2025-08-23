'use client';
import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { useProfileQuery } from '@/store/features/auth/authApi';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user, isLoading, isError } = useProfileQuery();
  const router = useRouter();

  if (isLoading)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (isError || !user) {
    // Optional: redirect to login page
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};
