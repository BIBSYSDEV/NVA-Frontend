import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { List, Typography } from '@material-ui/core';
import PublicationListItemComponent from '../dashboard/PublicationListItemComponent';
import { SearchResult } from '../../types/search.types';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  publications: SearchResult[];
  searchTerm: string | null;
}

const SearchResults: FC<SearchResultsProps> = ({ publications, searchTerm }) => {
  const { t } = useTranslation();

  return (
    <StyledSearchResults data-testid="search-results">
      {searchTerm && t('results', { count: publications.length, term: searchTerm })}
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
      {/* <Pagination data-testid="pagination" count={5} onClick={() => updateSearch(offset)} /> */}
    </StyledSearchResults>
  );
};

export default SearchResults;
