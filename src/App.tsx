import React from 'react';
import './styles/App.scss';
import Login from './components/login/Login';

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

export default App;
