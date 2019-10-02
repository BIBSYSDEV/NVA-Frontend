import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const AWSLogin: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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

    Auth.currentSession().then(data => {
      console.log('currentSession');
      console.log(data);
    });

    Auth.currentAuthenticatedUser()
      .then(user => {
        setUser(user);
        console.log('currentAuthenticatedUser:');
        console.log(
          user
            .getSignInUserSession()
            .getIdToken()
            .decodePayload().name
        );
      })
      .catch(err => console.log('Not signed in: ' + err));
  }, []);

  return (
    <div className="App">
      <button onClick={() => Auth.federatedSignIn()}>Login</button>
      {user && (
        <button onClick={() => Auth.signOut()}>
          Sign Out{' '}
          {
            user
              .getSignInUserSession()
              .getIdToken()
              .decodePayload().name
          }
        </button>
      )}
    </div>
  );
};

export default AWSLogin;
