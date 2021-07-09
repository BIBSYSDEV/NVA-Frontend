import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { List, Typography } from '@material-ui/core';
import { SearchResult } from '../../types/search.types';
import { RegistrationListItem } from '../dashboard/RegistrationListItem';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  searchResult: SearchResult;
}

export const SearchResults = ({ searchResult }: SearchResultsProps) => {
  const { t } = useTranslation('search');

  const registrations = searchResult.hits;

  return (
    <StyledSearchResults data-testid="search-results">
      <Typography variant="subtitle1">{t('hits', { count: searchResult.total })}</Typography>
      <List>
        {registrations &&
          registrations.map((registration) => (
            <RegistrationListItem key={registration.id} registration={registration} />
          ))}
      </List>
    </StyledSearchResults>
  );
};
