import '../../styles/dashboard.scss';

import React from 'react';

import SearchBar from '../search/SearchBar';

export interface DashboardProps {
  history: any;
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  return (
    <div className="dashboard">
      <SearchBar history={history} />
      <div className="other-content">Annet innhold</div>
    </div>
  );
};

export default Dashboard;
