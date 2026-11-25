// Error codes from the identity service. They reach the client inside Cognito's error message as
// "IdentityService-<code>", both from the inbound federation trigger and from the pre token trigger.
export enum IdentityServiceErrorCode {
  // Login without a national identity number, or a refresh with neither the number nor a link
  MissingNin = 1003,
  // A link without its person, or a password user without a Cristin id. Only damaged data or test users
  MissingLink = 1004,
  // The login could not resolve the person, e.g. not found or the registry is down
  LoginNotCompleted = 1005,
}

const identityServiceErrorCodePattern = /IdentityService-(\d+)/;

export const getIdentityServiceErrorCode = (errorMessage = '') => {
  const match = identityServiceErrorCodePattern.exec(errorMessage);
  return match ? Number(match[1]) : null;
};

export const getLoginErrorMessageKey = (errorMessage?: string) => {
  switch (getIdentityServiceErrorCode(errorMessage)) {
    case IdentityServiceErrorCode.MissingNin:
      return 'feedback.error.login_failed_try_bankid';
    case IdentityServiceErrorCode.LoginNotCompleted:
      return 'feedback.error.login_not_completed';
    default:
      return 'feedback.error.login_failed';
  }
};

// Another refresh cannot fix these, only a new login can
export const refreshErrorEndsSession = (errorMessage?: string) => {
  const code = getIdentityServiceErrorCode(errorMessage);
  return code === IdentityServiceErrorCode.MissingNin || code === IdentityServiceErrorCode.MissingLink;
};
