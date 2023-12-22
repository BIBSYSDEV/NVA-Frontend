import { ResourcesConfig } from 'aws-amplify';

export const authOptions: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID ?? '',
      userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID ?? '',
      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_DOMAIN ?? '',
          scopes: ['openid', 'https://api.nva.unit.no/scopes/frontend', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [process.env.REACT_APP_REDIRECT_SIGN_IN ?? ''],
          redirectSignOut: [process.env.REACT_APP_REDIRECT_SIGN_OUT ?? ''],
          responseType: 'code',
        },
        // username: true, ??
      },
    },
  },
};
