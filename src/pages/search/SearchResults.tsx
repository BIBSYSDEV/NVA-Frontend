import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Divider, Typography } from '@mui/material';
import { SearchResult } from '../../types/search.types';
import { RegistrationList } from '../../components/RegistrationList';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  searchResult: SearchResult;
}

export const SearchResults = ({ searchResult }: SearchResultsProps) => {
  const { t } = useTranslation('search');

  return (
    <StyledSearchResults data-testid="search-results">
      <Typography variant="subtitle1">{t('hits', { count: searchResult.total })}:</Typography>
      <Divider />
      <RegistrationList registrations={searchResult.hits} />
    </StyledSearchResults>
  );
};
