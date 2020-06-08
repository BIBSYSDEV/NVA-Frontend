import React, { FC, ComponentType } from 'react';
import { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import PrivateRoute from './PrivateRoute';

export interface LoggedInRouteProps extends RouteProps {
  component: ComponentType<any>;
}

export const LoggedInRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user} />;
};

export const PublisherRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && user.isPublisher} />;
};

export const CuratorRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && user.isCurator} />;
};

export const AppAdminRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && user.isAppAdmin} />;
};

export const InstitutionAdminRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={!!user && user.isInstitutionAdmin} />;
};
