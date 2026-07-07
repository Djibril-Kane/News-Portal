'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/services/authService';

export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { isReady, hasRole } = useAuth();
  const router = useRouter();

  const authorized = hasRole(...roles);

  useEffect(() => {
    if (isReady && !authorized) {
      router.replace('/login');
    }
  }, [isReady, authorized, router]);

  if (!isReady || !authorized) {
    return <div className="p-8 text-sm text-gray-500">Vérification des droits d'accès...</div>;
  }

  return <>{children}</>;
}
