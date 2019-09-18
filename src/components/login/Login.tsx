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

  console.log(user);

  return (
    <React.Fragment>
      {user && <h1>Hello {user.firstName}</h1>}
      <Button className="login__button" onClick={handleLogin}>
        {buttonText}
      </Button>
    </React.Fragment>
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
