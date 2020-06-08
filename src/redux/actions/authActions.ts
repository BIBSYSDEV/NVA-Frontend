export const LOGOUT_SUCCESS = 'logout success';

export const logoutSuccess = (): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
});

interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActions = LogoutSuccessAction;
