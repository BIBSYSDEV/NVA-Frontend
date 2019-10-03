import Amplify, { Auth } from 'aws-amplify';
import React, { useState } from 'react';

const AWSLogin: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {

  //   Auth.currentAuthenticatedUser()
  //     .then(user => {
  //       setUser(user);
  //       console.log('currentAuthenticatedUser:');
  //       console.log(
  //         user
  //           .getSignInUserSession()
  //           .getIdToken()
  //           .decodePayload().name
  //       );
  //     })
  //     .catch(err => console.log('Not signed in: ' + err));
  // }, []);

  return (
    <div className="App">
      <button onClick={() => Auth.federatedSignIn()}>Login</button>
      {user && (
        <button onClick={() => Auth.signOut()}>
          Sign Out{' '}
          {/* {
            user
              .getSignInUserSession()
              .getIdToken()
              .decodePayload().name
          } */}
        </button>
      )}
    </div>
  );
};

export default AWSLogin;
