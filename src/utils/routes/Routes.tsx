import { Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  isAuthorized: boolean;
}

export const PrivateRoute = ({ isAuthorized, ...rest }: PrivateRouteProps) =>
  isAuthorized ? (
    <Route {...rest} />
  ) : (
    <Route {...rest}>
      <Forbidden />
    </Route>
  );

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const BasicDataRoute = ({ component, ...rest }: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return (
    <PrivateRoute
      {...rest}
      component={component}
      isAuthorized={!!user && !!user.customerId && (user.isInstitutionAdmin || user.isAppAdmin)}
    />
  );
};
