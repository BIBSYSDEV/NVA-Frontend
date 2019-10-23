import '../../styles/dashboard.scss';

import React from 'react';

import SearchBar from '../../components/SearchBar';
import AdminMenu from './AdminMenu';

const Dashboard: React.FC = () => (
  <div className="dashboard">
    <AdminMenu />
    <SearchBar resetSearchInput />
    <div className="other-content">Annet innhold</div>
  </div>
);

export default Dashboard;
