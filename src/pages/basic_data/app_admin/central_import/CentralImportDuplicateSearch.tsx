import { Divider, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DescriptionFieldNames, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';
import { useQuery } from '@tanstack/react-query';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { useDispatch } from 'react-redux';

interface CentralImportDuplicateSearchProps {
  duplicateSearchFilters: DuplicateSearchFilters;
}

export const CentralImportDuplicateSearch = ({ duplicateSearchFilters }: CentralImportDuplicateSearchProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const maxHits = ROWS_PER_PAGE_OPTIONS[0];
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

  const searchQuery = queryArray.length > 0 ? `query=(${queryArray.join(' AND ')}&results=${maxHits})` : '';

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', searchQuery],
    queryFn: fetchImportCandidates,
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = importCandidateQuery.data?.hits ?? [];

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
          </>
        )
      )}
    </>
  );
};
