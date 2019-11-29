import Pagination from 'material-ui-flat-pagination';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import { search } from '../../api/searchApi';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ResourceMetadata } from '../../types/resource.types';
import { SEARCH_RESULTS_PER_PAGE } from '../../utils/constants';
import styled from 'styled-components';

interface SearchResultsProps {
  resources: ResourceMetadata[];
  searchTerm: string;
}

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

const SearchResults: React.FC<SearchResultsProps> = ({ resources, searchTerm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const results = useSelector((state: RootStore) => state.search);
  const [offset, setOffset] = useState(0);

  const updateSearch = (offset: number) => {
    setOffset(offset);
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm, offset));
      history.push(`/search/${searchTerm}/${offset}`);
    }
  };

  return (
    <StyledSearchResults data-testid="search-results">
      {t('Results', { count: results.totalNumberOfHits, term: searchTerm })} ({offset + 1} - {offset + resources.length}
      )
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
                  <>
                    <Typography component="span">{resource.creators}</Typography>
                    <br />
                    {resource.publisher}
                  </>
                }>
                {' '}
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <Pagination
        data-testid="pagination"
        limit={SEARCH_RESULTS_PER_PAGE}
        offset={offset}
        total={results.totalNumberOfHits}
        onClick={(_, offset) => updateSearch(offset)}
      />
    </StyledSearchResults>
  );
};

export default SearchResults;
