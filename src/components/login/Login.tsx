import React from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import User from '../../types/user.types';
import { Dispatch } from 'redux';
import { setUser } from '../../actions/userActions';

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
    <div className="login__wrapper">
      {user.firstName ? (
        <div className="username">Hello {user.firstName}</div>
      ) : (
        <Button className="login__button" onClick={handleLogin}>
          {buttonText}
        </Button>
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
