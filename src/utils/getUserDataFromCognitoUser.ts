import { Dispatch } from 'redux';
import { setUser } from '../actions/userActions';
import { Auth } from 'aws-amplify';

export const getUserDataFromCognitoUser = (user: any) => {
  return async (dispatch: Dispatch) => {
    await Auth.currentSession();
    const session = await user.getSignInUserSession();
    const payload = session.getIdToken().decodePayload();
    dispatch(setUser(payload));
  };
};
