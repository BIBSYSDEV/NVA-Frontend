import { ReactElement } from 'react';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps {
  isAuthorized: boolean;
  element: ReactElement;
}

export const PrivateRoute = ({ isAuthorized, element }: PrivateRouteProps) => (isAuthorized ? element : <Forbidden />);
