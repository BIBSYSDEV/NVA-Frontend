import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../actions/userActions';
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
    dispatch(setUser({ firstName: 'Gregor', lastName: 'Gabriel' }));
  };

  return (
    <div className="login">
      {user && user.firstName ? (
        <div className="login__username">
          <Typography variant="h6">
            {t('Hello')} {user.firstName}
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
