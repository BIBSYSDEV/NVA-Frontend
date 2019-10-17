import '../../styles/dashboard.scss';

import React from 'react';

import SearchBar from '../../components/SearchBar';

const Dashboard: React.FC = () => (
  <div className="dashboard">
    <SearchBar resetSearch />
    <div className="other-content">Annet innhold</div>
  </div>
);

export default Dashboard;
