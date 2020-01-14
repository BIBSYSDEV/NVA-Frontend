describe('Env-variables', () => {
  test('tests that mandatory environment variables are set', async () => {
    const requiredEnv = [
      'REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID',
      'REACT_APP_AWS_USER_POOLS_ID',
      'REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID',
      'REACT_APP_DOMAIN',
      'REACT_APP_REDIRECT_SIGN_IN',
      'REACT_APP_REDIRECT_SIGN_OUT',
      'REACT_APP_ORCID_CLIENT_ID',
      'REACT_APP_ORCID_CLIENT_SECRET',
      'REACT_APP_ORCID_REDIRECT_URI',
      'REACT_APP_ORCID_BASE_URL',
      'REACT_APP_CRISTIN_API_URL',
      'REACT_APP_API_URL',
    ];
    const unsetEnv = requiredEnv.filter(env => !(typeof process.env[env] !== 'undefined'));
    if (unsetEnv.length > 0) {
      throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']');
    }
  });
});
