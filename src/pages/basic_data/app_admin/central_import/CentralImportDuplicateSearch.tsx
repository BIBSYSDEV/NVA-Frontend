import { Divider, List, TablePagination, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';
import { useQuery } from '@tanstack/react-query';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { useState } from 'react';

interface CentralImportDuplicateSearchProps {
  duplicateSearchFilters: DuplicateSearchFilters;
}

export const CentralImportDuplicateSearch = ({ duplicateSearchFilters }: CentralImportDuplicateSearchProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const queryArray = [];
  duplicateSearchFilters.doi.length > 0 && queryArray.push(`doi:"${duplicateSearchFilters.doi}"`);
  duplicateSearchFilters.title.length > 0 && queryArray.push(`mainTitle:"${duplicateSearchFilters.title}"`);
  duplicateSearchFilters.author.length > 0 &&
    queryArray.push(`entityDescription.contributors.identity.name:"${duplicateSearchFilters.author}"`);
  duplicateSearchFilters.issn.length > 0 &&
    queryArray.push(`entityDescription.reference.publicationContext.printIssn:"${duplicateSearchFilters.issn}"`);
  duplicateSearchFilters.yearPublished.length > 0 &&
    queryArray.push(`publicationYear:"${duplicateSearchFilters.yearPublished}"`);

  const searchQuery = queryArray.length > 0 ? queryArray.join(' AND ') : '';

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', rowsPerPage, page, searchQuery],
    queryFn: () => fetchImportCandidates(rowsPerPage, page, searchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = importCandidateQuery.data?.hits ?? [];
  const totalCount = importCandidateQuery.data?.size ?? 0;

  return (
    <>
      {importCandidateQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">
              {t('basic_data.central_import.duplicate_search_hits_shown', {
                ShownResultsCount: searchResults.length,
                TotalResultsCount: importCandidateQuery.data?.size,
              })}
              :
            </Typography>
            <Divider />
            <List>
              {searchResults.map((importCandidate) => (
                <CentralImportResultItem importCandidate={importCandidate} key={importCandidate.id} />
              ))}
            </List>
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
              }}
            />
          </>
        )
      )}
    </>
  );
};
