import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';

export const authOptions: AuthOptions = {
  userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {
    domain: import.meta.env.VITE_DOMAIN ?? '',
    scope: ['openid', 'https://api.nva.unit.no/scopes/frontend', 'aws.cognito.signin.user.admin'],
    redirectSignIn: import.meta.env.VITE_REDIRECT_SIGN_IN ?? '',
    redirectSignOut: import.meta.env.VITE_REDIRECT_SIGN_OUT ?? '',
    responseType: 'code',
  },
};
