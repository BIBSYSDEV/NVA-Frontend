import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
//import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const AWSLogin: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log('creds:', Auth.currentCredentials());

    Hub.listen('auth', ({ payload: { event, data } }) => {
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
        setUser(user);
      })
      .catch(err => console.log('Not signed in: ' + err));
  }, []);

  return (
    <div className="App">
      <button onClick={() => Auth.federatedSignIn()}>Login</button>
      {user && <button onClick={() => Auth.signOut()}>Sign Out {user.getUsername()}</button>}
    </div>
  );
};

export default AWSLogin;
