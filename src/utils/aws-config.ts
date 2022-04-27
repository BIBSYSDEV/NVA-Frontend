import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';

export const authOptions: AuthOptions = {
  userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
  userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.REACT_APP_DOMAIN ?? '',
    scope: ['openid', 'https://api.nva.unit.no/scopes/frontend', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN ?? '',
    redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT ?? '',
    responseType: 'code',
  },
};
