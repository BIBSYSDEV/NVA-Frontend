import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUser } from '../../api/user';
import { RootStore } from '../../reducers/rootReducer';
import '../../styles/login.scss';

interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleLogin = (event: React.MouseEvent<any>) => {
    // TODO connect with FEIDE with real data
    dispatch(getLoggedInUser());
  };

  return (
    <div className="login">
      {user && user.name ? (
        <div className="login__username">
          <Typography variant="h6">
            {t('Hello')} {user.name}
          </Typography>
        </div>
      ) : (
        <div className="login__button">
          <Button onClick={handleLogin}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default Login;
