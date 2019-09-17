import React from 'react';
import './styles/App.scss';
import Login from './components/login/Login';
// import Amplify from 'aws-amplify';
// import { withAuthenticator } from 'aws-amplify-react';
// import config from './aws-exports';
//
// Amplify.configure(config);

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="header">
        header
        <Login buttonText="login" />
      </div>
      <div className="body">body</div>
      <div className="footer">footer</div>
    </div>
  );
};

// export default withAuthenticator(App, true);
export default App;
