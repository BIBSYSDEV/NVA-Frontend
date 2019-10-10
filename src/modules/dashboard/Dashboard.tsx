import '../../styles/dashboard.scss';

import React from 'react';

import SearchBar from '../../components/search/SearchBar';

const Dashboard: React.FC = () => (
  <div className="dashboard">
    <SearchBar />
    <div className="other-content">Annet innhold</div>
  </div>
);

export default Dashboard;
