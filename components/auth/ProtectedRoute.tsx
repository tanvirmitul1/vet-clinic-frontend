'use client';

import { useProfileQuery } from '@/store/features/auth/authApi';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // optional role-based access
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: user, isLoading, isError } = useProfileQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized'); // optional unauthorized page
      }
    }
  }, [user, isLoading, isError, allowedRoles, router]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return null;

  return <>{children}</>;
};
