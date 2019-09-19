import React from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import User from '../../types/user.types';
import { setUser } from '../../actions/userActions';
import '../../styles/login.scss';

interface LoginProps {
  buttonText: string;
}

interface ReduxStateProps {
  user: User;
}

interface ReduxDispatchProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps & ReduxStateProps & ReduxDispatchProps> = ({ buttonText, user, setUser }) => {
  const handleLogin = (event: React.MouseEvent<any>) => {
    // TODO connect with FEIDE with real data
    setUser({ firstName: 'Gregor', lastName: 'Gabriel' });
  };

  return (
    <div className="login">
      {user && user.firstName ? (
        <div className="login__username">Hello {user.firstName}</div>
      ) : (
        <div className="login__button">
          <Button onClick={handleLogin}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUser: (user: User) => dispatch(setUser(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
