import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { List, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { search } from '../../api/publicationApi';
import { RootStore } from '../../redux/reducers/rootReducer';
import PublicationListItemComponent from '../dashboard/PublicationListItemComponent';
import { SearchResult } from '../../types/search.types';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  publications: SearchResult[];
  searchTerm: string;
}

const SearchResults: FC<SearchResultsProps> = ({ publications, searchTerm }) => {
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
            <PublicationListItemComponent
              key={publication.identifier}
              primaryComponent={
                <MuiLink component={Link} to={`/publication/${publication.identifier}/public`}>
                  {publication.mainTitle}
                </MuiLink>
              }
              secondaryComponent={
                <Typography component="span">
                  {new Date(publication.modifiedDate).toLocaleDateString()}
                  <br />
                  {publication.contributors.map((contributor) => contributor.name)}
                </Typography>
              }
            />
          ))}
      </List>
      {/* TODO: Pagination has no function atm */}
      <Pagination data-testid="pagination" count={5} onClick={() => updateSearch(offset)} />
    </StyledSearchResults>
  );
};

export default SearchResults;
