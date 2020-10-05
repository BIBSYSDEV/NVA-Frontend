import React, { FC, ComponentType } from 'react';
import { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import PrivateRoute from './PrivateRoute';

export interface LoggedInRouteProps extends RouteProps {
  component: ComponentType<any>;
}

export const LoggedInRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => (
  <PrivateRoute {...rest} component={component} isAuthorized />
);

export const CreatorRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={user.isCreator} />;
};

export const CuratorRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={user.isCurator} />;
};

export const AppAdminRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={user.isAppAdmin} />;
};

export const InstitutionAdminRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return <PrivateRoute {...rest} component={component} isAuthorized={user.isInstitutionAdmin} />;
};

export const EditInstitutionRoute: FC<LoggedInRouteProps> = ({ component, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  // NB! Institution-admin should only be allowed to update it's own institution,
  // so ensure this is enforced in the actual component(s)
  return <PrivateRoute {...rest} component={component} isAuthorized={user.isInstitutionAdmin || user.isAppAdmin} />;
};
