import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';

import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';

const awsconfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.REACT_APP_AWS_COGNITO_IDENTETY_POOL_ID,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
  federationTarget: process.env.REACT_APP_FEDERATIONTARGET,
};

const oauth = {
  domain: 'nva-frontend-auth-test-dev.auth.eu-west-1.amazoncognito.com',
  scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'http://localhost:3000/',
  redirectSignOut: 'http://localhost:3000/',
  responseType: 'code',
};

console.log(process.env);
Amplify.configure(awsconfig);
Auth.configure({ oauth });

const AWSLogin: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log(event);
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          break;
        default:
          setUser(null);
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(user);
        setUser(user);
      })
      .catch(err => console.log('Not signed in' + err));
  }, []);

  const handleClick = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  return (
    <div className="App">
      <button onClick={handleClick}>Open Google</button>
      <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
      {user && <button onClick={() => Auth.signOut()}>Sign Out {user.getUsername()}</button>}
    </div>
  );
};

export default AWSLogin;
