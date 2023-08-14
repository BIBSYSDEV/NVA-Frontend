import { Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../../../../api/searchApi';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RegistrationList } from '../../../../components/RegistrationList';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';
import { DescriptionFieldNames, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';

interface CentralImportDuplicateSearchProps {
  duplicateSearchFilters: DuplicateSearchFilters;
}

export const CentralImportDuplicateSearch = ({ duplicateSearchFilters }: CentralImportDuplicateSearchProps) => {
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
    queryArray.push(`entityDescription.reference.publicationContext.printIssn:"${duplicateSearchFilters.issn}"`);
  duplicateSearchFilters.yearPublished.length > 0 &&
    queryArray.push(`${DescriptionFieldNames.PublicationYear}:"${duplicateSearchFilters.yearPublished}"`);

  const searchQuery = queryArray.length > 0 ? queryArray.join(' AND ') : '';

  const duplicatesQuery = useQuery({
    queryKey: ['registrationsSearch', rowsPerPage, page, searchQuery],
    queryFn: () => fetchResults(rowsPerPage, (page - 1) * rowsPerPage, searchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = duplicatesQuery.data?.hits ?? [];
  const totalCount = duplicatesQuery.data?.size ?? 0;

  return (
    <>
      {duplicatesQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">
              {t('basic_data.central_import.duplicate_search_hits_shown', {
                ShownResultsCount: searchResults.length,
                TotalResultsCount: duplicatesQuery.data?.size,
              })}
              :
            </Typography>
            <Divider />
            <RegistrationList registrations={duplicatesQuery.data?.hits ?? []} />
            <ListPagination
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(1);
              }}
            />
          </>
        )
      )}
    </>
  );
};
