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
export const LoggedInRoute = ({ component, ...rest }: RouteProps) => {
  const { user } = useSelector((store: RootState) => store);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user} />;
};

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const CreatorRoute = (props: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return <PrivateRoute {...props} isAuthorized={!!user && !!user.customerId && (user.isCreator || user.isCurator)} />;
};

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const CuratorRoute = ({ component, ...rest }: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && !!user.customerId && user.isCurator} />;
};

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const AppAdminRoute = ({ component, ...rest }: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && !!user.customerId && user.isAppAdmin} />;
};

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const InstitutionAdminRoute = ({ component, ...rest }: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return (
    <PrivateRoute
      {...rest}
      component={component}
      isAuthorized={!!user && !!user.customerId && user.isInstitutionAdmin}
    />
  );
};

/**
 * @deprecated Use <PrivateRoute /> with isAuthorized prop instead
 */
export const EditorRoute = ({ component, ...rest }: RouteProps) => {
  const user = useSelector((store: RootState) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && !!user.customerId && user.isEditor} />;
};
