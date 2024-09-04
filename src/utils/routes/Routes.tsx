import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthorized: boolean;
  element: ReactElement;
}

export const PrivateRoute = ({ isAuthorized, element }: PrivateRouteProps) =>
  isAuthorized ? element : <Navigate to="/forbidden" replace />;
