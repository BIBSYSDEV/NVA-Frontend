import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TablePagination, Typography } from '@material-ui/core';
import ListSkeleton from '../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import SearchResults from './SearchResults';

interface RegistrationSearchProps {
  searchTerm?: string;
  noHitsText?: string;
}

const RegistrationSearch: FC<RegistrationSearchProps> = ({ searchTerm, noHitsText }) => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);
  const [registrations, isLoadingSearch] = useSearchRegistrations(searchTerm, rowsPerPage, page * rowsPerPage);
  const { t } = useTranslation('common');

  // Ensure selected page is not out of bounds
  const validPage = registrations && registrations.hits.length <= page * rowsPerPage ? 0 : page;

  return (
    <>
      {isLoadingSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : registrations && registrations.hits.length > 0 ? (
        <>
          <SearchResults searchResult={registrations} searchTerm={searchTerm} />
          {registrations.hits.length > ROWS_PER_PAGE_OPTIONS[0] && (
            <TablePagination
              data-testid="search-pagination"
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={registrations.hits.length}
              rowsPerPage={rowsPerPage}
              page={validPage}
              onChangePage={(_, newPage) => setPage(newPage)}
              onChangeRowsPerPage={(event) => {
                setRowsPerPage(parseInt(event.target.value));
                setPage(0);
              }}
            />
          )}
        </>
      ) : (
        <Typography>{noHitsText ? noHitsText : t('no_hits')}</Typography>
      )}
    </>
  );
};

export default RegistrationSearch;
