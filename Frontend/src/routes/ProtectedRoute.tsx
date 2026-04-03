import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

type Props = {
  children: ReactNode;
};

/**
 * Requires auth hydration to finish, then a logged-in user.
 * Unauthenticated users are sent to /login with return path in location state.
 */
export function ProtectedRoute({ children }: Props) {
  const initialized = useAppSelector(s => s.auth.initialized);
  const user = useAppSelector(s => s.auth.user);
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
        Checking session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
