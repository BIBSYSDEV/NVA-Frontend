import '../../styles/pages/dashboard.scss';

import React, { Dispatch } from 'react';

import SearchBar from '../../components/SearchBar';
import { SearchActions } from '../../redux/actions/searchActions';

interface DashboardProps {
  dispatchSearch: Dispatch<SearchActions>;
}
const Dashboard: React.FC<DashboardProps> = ({ dispatchSearch }) => (
  <div className="dashboard">
    <SearchBar resetSearchInput dispatchSearch={dispatchSearch} />
    <div className="other-content">Annet innhold</div>
  </div>
);

export default Dashboard;
