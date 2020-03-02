export const LOGIN_SUCCESS = 'login success';
export const LOGOUT_SUCCESS = 'logout success';

export const loginSuccess = (): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
});

export const logoutSuccess = (): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
});

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
}

interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActions = LoginSuccessAction | LogoutSuccessAction;
