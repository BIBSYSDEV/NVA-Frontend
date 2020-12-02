import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TablePagination, List, Typography } from '@material-ui/core';
import RegistrationListItem from '../dashboard/RegistrationListItem';
import { SearchResult } from '../../types/search.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

interface SearchResultsProps {
  searchResult: SearchResult;
  searchTerm?: string;
}

const SearchResults: FC<SearchResultsProps> = ({ searchResult, searchTerm }) => {
  const { t } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const registrations = searchResult.hits;

  // Ensure selected page is not out of bounds
  const validPage = registrations.length <= page * rowsPerPage ? 0 : page;

  return (
    <StyledSearchResults data-testid="search-results">
      {searchTerm && (
        <Typography variant="subtitle1">{t('search_summary', { count: searchResult.total, searchTerm })}</Typography>
      )}
      <List>
        {registrations &&
          registrations
            .slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage)
            .map((registration) => <RegistrationListItem key={registration.id} registration={registration} />)}
      </List>
      {registrations.length > ROWS_PER_PAGE_OPTIONS[0] && (
        <TablePagination
          data-testid="search-pagination"
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={registrations.length}
          rowsPerPage={rowsPerPage}
          page={validPage}
          onChangePage={(_, newPage) => setPage(newPage)}
          onChangeRowsPerPage={(event) => {
            setRowsPerPage(parseInt(event.target.value));
            setPage(0);
          }}
        />
      )}
    </StyledSearchResults>
  );
};

export default SearchResults;
