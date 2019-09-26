import '../../styles/dashboard.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';

import { getResources } from '../../api/resource';
import { RootStore } from '../../reducers/rootReducer';
import IconButton from '../muicomponents/IconButton';
import InputBase from '../muicomponents/InputBase';
import Paper from '../muicomponents/Paper';
import ResourceList from '../resources/ResourceList';

const Dashboard: React.FC = () => {
  const resources = useSelector((state: RootStore) => state.resources);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <Paper className="paper">
        <form
          className="search-container"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            dispatch(getResources());
          }}>
          <InputBase className="input" placeholder={t('Search')} />
          <IconButton className="search-button" onClick={() => dispatch(getResources())}>
            <SearchIcon />
          </IconButton>
        </form>
      </Paper>
      <div className="search-results">
        {resources && resources.length > 0 && <ResourceList resources={resources} />}
      </div>
    </div>
  );
};

export default Dashboard;
