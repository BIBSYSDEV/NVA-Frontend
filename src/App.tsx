import React from 'react';
import './styles/App.scss';
import Login from './components/login/Login';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="Header">
        header
        <Login buttonText="login" />
      </div>
      <div className="Body">body</div>
      <div className="Footer">footer</div>
    </div>
  );
};

export default App;
