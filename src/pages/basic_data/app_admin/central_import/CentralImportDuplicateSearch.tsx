import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../../../../api/searchApi';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RegistrationListItemContent } from '../../../../components/RegistrationList';
import { SearchListItem } from '../../../../components/styled/Wrappers';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';
import { DescriptionFieldNames, ResourceFieldNames } from '../../../../types/publicationFieldNames';
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

  const queryArray = [];
  duplicateSearchFilters.doi.length > 0 && queryArray.push(`${ResourceFieldNames.Doi}:"${duplicateSearchFilters.doi}"`);
  duplicateSearchFilters.title.length > 0 &&
    queryArray.push(`${DescriptionFieldNames.Title}:"${duplicateSearchFilters.title}"`);
  duplicateSearchFilters.author.length > 0 &&
    queryArray.push(`entityDescription.contributors.identity.name:"${duplicateSearchFilters.author}"`);
  duplicateSearchFilters.issn.length > 0 &&
    queryArray.push(
      `(entityDescription.reference.publicationContext.printIssn:"${duplicateSearchFilters.issn}" OR entityDescription.reference.publicationContext.onlineIssn:"${duplicateSearchFilters.issn}")`
    );
  duplicateSearchFilters.yearPublished.length > 0 &&
    queryArray.push(`${DescriptionFieldNames.PublicationYear}:"${duplicateSearchFilters.yearPublished}"`);

  const searchQuery = queryArray.length > 0 ? `(${queryArray.join(' AND ')})` : '';

  const duplicateCandidatesQuery = useQuery({
    queryKey: ['registrationsSearch', rowsPerPage, page, searchQuery],
    queryFn: () => fetchResults(rowsPerPage, (page - 1) * rowsPerPage, searchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });
  const duplicateCandidatesSize = duplicateCandidatesQuery.data?.size ?? 0;

  return (
    <Box sx={{ border: '1px solid black', padding: { xs: '0.5rem', sm: '0.5rem 1rem' }, mt: '1rem' }}>
      {duplicateCandidatesQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          <Typography variant="subtitle1">
            {duplicateCandidatesSize === 0
              ? t('basic_data.central_import.duplicate_search_no_hits')
              : t('basic_data.central_import.duplicate_search_hits')}
          </Typography>
          {duplicateCandidatesSize > 0 && (
            <>
              <FormControl sx={{ width: '100%' }}>
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
              <ListPagination
                sx={{ mt: '0.5rem' }}
                count={duplicateCandidatesSize}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(1);
                }}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};
