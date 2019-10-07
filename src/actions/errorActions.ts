export const LOGIN_FAILURE = 'login failure';

export const loginFailureAction = (message: string) => ({
  type: LOGIN_FAILURE,
  message,
});

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  message: string;
}

export type ErrorActions = LoginFailureAction;
