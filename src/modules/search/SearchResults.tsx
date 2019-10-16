import '../../styles/search.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import Pagination from 'material-ui-flat-pagination';
import { Resource } from '../../types/resource.types';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../reducers/rootReducer';
import { search } from '../../api/resource';
import { useHistory } from 'react-router';
import { RESULTS_PR_PAGE } from '../../types/search.types';

export interface SearchResultsProps {
  resources: Resource[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ resources, searchTerm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSearch = (offset: number) => {
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm, offset));
      history.push(`/Search/${searchTerm}`);
    }
  };

  const results = useSelector((state: RootStore) => state.results);
  const [offset, setOffset] = useState(0);

  const updateOffset = (offset: number) => {
    setOffset(offset);
    handleSearch(offset);
  };

  return (
    <div className="search-results" data-cy="search-results">
      {t('Results', { count: results.totalNumberOfHits, term: searchTerm })} ({offset + 1} - {offset + resources.length}
      )
      <List>
        {resources &&
          resources.map((resource, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                data-cy="result-list-item"
                primary={resource.title}
                secondary={
                  <React.Fragment>
                    <Typography component="span">{resource.identifier_handle}</Typography>
                    <br />
                    {resource.description}
                  </React.Fragment>
                }>
                {' '}
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <Pagination
        data-cy="pagination"
        limit={RESULTS_PR_PAGE}
        offset={offset}
        total={results.totalNumberOfHits}
        onClick={(e, offset) => updateOffset(offset)}
      />
    </div>
  );
};

export default SearchResults;
