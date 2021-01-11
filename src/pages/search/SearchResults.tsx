import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { List, Typography } from '@material-ui/core';
import { SearchResult } from '../../types/search.types';
import RegistrationListItem from '../dashboard/RegistrationListItem';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  searchResult: SearchResult;
  searchTerm?: string;
}

const SearchResults = ({ searchResult, searchTerm }: SearchResultsProps) => {
  const { t } = useTranslation('common');

  const registrations = searchResult.hits;

  return (
    <StyledSearchResults data-testid="search-results">
      {searchTerm && (
        <Typography variant="subtitle1">{t('search_summary', { count: searchResult.total, searchTerm })}</Typography>
      )}
      <List>
        {registrations &&
          registrations.map((registration) => (
            <RegistrationListItem key={registration.id} registration={registration} />
          ))}
      </List>
    </StyledSearchResults>
  );
};

export default SearchResults;
