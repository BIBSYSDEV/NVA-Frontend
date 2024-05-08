import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../../../../api/searchApi';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RegistrationListItemContent } from '../../../../components/RegistrationList';
import { SearchListItem } from '../../../../components/styled/Wrappers';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';

interface CentralImportDuplicateSearchProps {
  duplicateSearchFilters: DuplicateSearchFilters;
  registrationIdentifier: string;
  setRegistrationIdentifier: (identifier: string) => void;
}

export const CentralImportDuplicateSearch = ({
  duplicateSearchFilters,
  registrationIdentifier,
  setRegistrationIdentifier,
}: CentralImportDuplicateSearchProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const searchConfig: FetchResultsParams = {
    doi: duplicateSearchFilters.doi,
    contributorName: duplicateSearchFilters.author,
    issn: duplicateSearchFilters.issn,
    publicationYearShould: duplicateSearchFilters.yearPublished,
    title: duplicateSearchFilters.title,
    from: rowsPerPage * (page - 1),
    results: rowsPerPage,
  };

  const duplicateCandidatesQuery = useQuery({
    queryKey: ['registrations', searchConfig],
    queryFn: () => fetchResults(searchConfig),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });
  const duplicateCandidatesSize = duplicateCandidatesQuery.data?.totalHits ?? 0;

  return (
    <Box sx={{ border: '1px solid black', padding: { xs: '0.5rem', sm: '0.5rem 1rem' }, mt: '1rem' }}>
      {duplicateCandidatesQuery.isPending ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            {duplicateCandidatesSize === 0
              ? t('basic_data.central_import.duplicate_search_no_hits')
              : t('basic_data.central_import.duplicate_search_hits')}
          </Typography>
          {duplicateCandidatesSize > 0 && (
            <ListPagination
              count={duplicateCandidatesSize}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(1);
              }}>
              <FormControl sx={{ width: '100%', mb: '0.5rem' }}>
                <RadioGroup
                  value={registrationIdentifier}
                  onChange={(event) => setRegistrationIdentifier(event.target.value)}>
                  {duplicateCandidatesQuery.data?.hits.map((registration) => (
                    <FormControlLabel
                      key={registration.identifier}
                      value={registration.identifier}
                      sx={{ '.MuiFormControlLabel-label': { width: '100%' } }}
                      control={<Radio />}
                      label={
                        <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
                          <RegistrationListItemContent registration={registration} />
                        </SearchListItem>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </ListPagination>
          )}
        </>
      )}
    </Box>
  );
};
