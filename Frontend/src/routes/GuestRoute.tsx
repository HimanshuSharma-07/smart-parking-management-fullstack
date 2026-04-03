import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

type Props = {
  children: ReactNode;
};

/**
 * For /login and /register — if already signed in, skip the auth screen.
 */
export function GuestRoute({ children }: Props) {
  const initialized = useAppSelector(s => s.auth.initialized);
  const user = useAppSelector(s => s.auth.user);

  if (!initialized) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm">
        Checking session…
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/parking-lots" replace />;
  }

  return <>{children}</>;
}
