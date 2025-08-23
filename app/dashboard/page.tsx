'use client';

import { CircularProgress, Box, Typography, Card, CardContent } from '@mui/material';

import { useProfileQuery } from '@/store/features/auth/authApi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  // 🔹 Call RTK Query hook (no args needed for /me API)
  const { data: user, isLoading, isError } = useProfileQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">Failed to load user data.</Typography>
      </Box>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
      <Box p={4} display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3}>
        {/* Common user card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Welcome, {user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role}
            </Typography>
          </CardContent>
        </Card>

        {/* Role-specific cards */}
        {user.role === 'admin' && (
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Admin Panel</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users, roles, and permissions here.
              </Typography>
            </CardContent>
          </Card>
        )}

        {user.role === 'manager' && (
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Manager Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Track reports and supervise teams.
              </Typography>
            </CardContent>
          </Card>
        )}

        {user.role === 'user' && (
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">User Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Access your personal data and settings.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </ProtectedRoute>
  );
}
