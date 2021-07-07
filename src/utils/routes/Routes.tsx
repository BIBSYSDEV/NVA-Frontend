import React, { ComponentType, ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { PrivateRoute } from './PrivateRoute';

interface LoggedInRouteProps extends RouteProps {
  component: ComponentType<ReactNode>;
}

export const LoggedInRoute = ({ component, ...rest }: LoggedInRouteProps) => {
  const { user } = useSelector((store: RootStore) => store);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user} />;
};

export const CreatorRoute = ({ component, ...rest }: LoggedInRouteProps) => {
  const user = useSelector((store: RootStore) => store.user);

  return (
    <PrivateRoute
      {...rest}
      component={component}
      isAuthorized={!!user && !!user.customerId && (user.isCreator || user.isCurator)}
    />
  );
};

export const CuratorRoute = ({ component, ...rest }: LoggedInRouteProps) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && !!user.customerId && user.isCurator} />;
};

export const AppAdminRoute = ({ component, ...rest }: LoggedInRouteProps) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && !!user.customerId && user.isAppAdmin} />;
};

export const InstitutionAdminRoute = ({ component, ...rest }: LoggedInRouteProps) => {
  const user = useSelector((store: RootStore) => store.user);

  return (
    <PrivateRoute
      {...rest}
      component={component}
      isAuthorized={!!user && !!user.customerId && user.isInstitutionAdmin}
    />
  );
};
