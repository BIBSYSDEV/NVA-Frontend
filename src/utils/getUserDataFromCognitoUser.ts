import User from '../types/user.types';

export const getUserDataFromCognitoUser = (user: any): User => {
  const awsuser = user
    .getSignInUserSession()
    .getIdToken()
    .decodePayload();

  const { email, name } = awsuser;
  return {
    name,
    email,
  };
};
