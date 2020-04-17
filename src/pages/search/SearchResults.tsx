import Pagination from 'material-ui-flat-pagination';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import { search } from '../../api/publicationApi';
import { RootStore } from '../../redux/reducers/rootReducer';
import { SEARCH_RESULTS_PER_PAGE } from '../../utils/constants';

interface SearchResultsProps {
  publications: any[];
  searchTerm: string;
}

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

const SearchResults: React.FC<SearchResultsProps> = ({ publications, searchTerm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const results = useSelector((state: RootStore) => state.search);
  const [offset, setOffset] = useState(0);

  const updateSearch = async (offset: number) => {
    setOffset(offset);
    if (searchTerm.length) {
      await search(searchTerm, dispatch, offset);
      history.push(`/search/${searchTerm}/${offset}`);
    }
  };

  return (
    <StyledSearchResults data-testid="search-results">
      {t('results', { count: results.totalNumberOfHits, term: searchTerm })} ({offset + 1} -{' '}
      {offset + publications.length})
      <List>
        {publications &&
          publications.map((publication) => (
            <ListItem key={publication.handle}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                data-testid="result-list-item"
                primary={publication.titles.en}
                secondary={
                  <>
                    <Typography component="span">{publication.creators}</Typography>
                    <br />
                    {publication.publisher}
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
