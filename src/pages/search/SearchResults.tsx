import '../../styles/pages/search.scss';

import Pagination from 'material-ui-flat-pagination';
import React, { Dispatch, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import { search } from '../../api/search';
import { SearchActions } from '../../redux/actions/searchActions';
import { SearchResult } from '../../types/search.types';
import { SEARCH_RESULTS_PER_PAGE } from '../../utils/constants';

export interface SearchResultsProps {
  dispatchSearch: Dispatch<SearchActions>;
  searchResults: SearchResult;
}

const SearchResults: React.FC<SearchResultsProps> = ({ dispatchSearch, searchResults }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { resources, searchTerm, totalNumberOfHits, offset } = searchResults;
  const [localOffset, setLocalOffset] = useState(offset);

  const updateSearch = (offset: number) => {
    setLocalOffset(offset);
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm, dispatchSearch, offset));
      history.push(`/search/${searchTerm}/${offset}`);
    }
  };

  return (
    <div className="search-results" data-testid="search-results">
      {t('Results', { count: totalNumberOfHits, term: searchTerm })} ({localOffset + 1} -{' '}
      {localOffset + resources.length})
      <List>
        {resources &&
          resources.map(resource => (
            <ListItem key={resource.handle}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                data-testid="result-list-item"
                primary={resource.titles.en}
                secondary={
                  <React.Fragment>
                    <Typography component="span">{resource.creators}</Typography>
                    <br />
                    {resource.publisher}
                  </React.Fragment>
                }>
                {' '}
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <Pagination
        data-testid="pagination"
        limit={SEARCH_RESULTS_PER_PAGE}
        offset={localOffset}
        total={totalNumberOfHits}
        onClick={(_, offset) => updateSearch(offset)}
      />
    </div>
  );
};

export default SearchResults;
