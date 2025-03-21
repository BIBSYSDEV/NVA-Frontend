import { ResourcesConfig } from 'aws-amplify';

export const authOptions: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID ?? '',
      userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID ?? '',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_DOMAIN ?? '',
          scopes: ['openid', 'https://api.nva.unit.no/scopes/frontend'],
          redirectSignIn: [import.meta.env.VITE_REDIRECT_SIGN_IN ?? ''],
          redirectSignOut: [import.meta.env.VITE_REDIRECT_SIGN_OUT ?? ''],
          responseType: 'code',
        },
      },
    },
  },
};
