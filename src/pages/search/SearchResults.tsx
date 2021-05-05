import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { List, Typography } from '@material-ui/core';
import { SearchResult } from '../../types/search.types';
import RegistrationListItem from '../dashboard/RegistrationListItem';

const StyledTypography = styled(Typography)`
  font-weight: 600;
`;

interface SearchResultsProps {
  searchResult: SearchResult;
}

export const SearchResults = ({ searchResult }: SearchResultsProps) => {
  const { t } = useTranslation('common');

  const registrations = searchResult.hits;

  return (
    <div data-testid="search-results">
      <StyledTypography variant="subtitle1">
        {registrations.length === 0 ? t('no_hits') : t('search_summary_simple', { count: searchResult.total })}
      </StyledTypography>

      <List disablePadding>
        {registrations &&
          registrations.map((registration) => (
            <RegistrationListItem key={registration.id} registration={registration} />
          ))}
      </List>
    </div>
  );
};
