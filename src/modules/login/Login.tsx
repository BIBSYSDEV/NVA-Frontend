import { Button, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUser } from '../../api/user';
import { RootStore } from '../../reducers/rootReducer';
import '../../styles/login.scss';

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../aws-config';

Amplify.configure(awsConfig);
interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  console.log('awsconfig', awsConfig);
  const { t } = useTranslation();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('user', user);
        const user2 = user
          .getSignInUserSession()
          .getIdToken()
          .decodePayload();
        console.log('user:', user2);
      })
      .catch(err => console.log('Not signed in: ' + err));
  }, []);

  const handleLogin = (event: React.MouseEvent<any>) => {
    Auth.federatedSignIn();
    // dispatch(getLoggedInUser());
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
