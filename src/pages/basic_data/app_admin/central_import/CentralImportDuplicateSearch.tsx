import { Divider, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { Registration } from '../../../../types/registration.types';
import { SearchApiPath } from '../../../../api/apiPaths';
import { SearchResponse } from '../../../../types/common.types';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DescriptionFieldNames, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { DuplicateSearchFilters } from '../../../../types/duplicateSearchTypes';

interface CentralImportDuplicateSearchProps {
  duplicateSearchFilters: DuplicateSearchFilters;
}

export const CentralImportDuplicateSearch = ({ duplicateSearchFilters }: CentralImportDuplicateSearchProps) => {
  const { t } = useTranslation('basicData');

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

  const searchQuery = queryArray.length > 0 ? `query=(${queryArray.join(' AND ')})` : '';

  const [searchResults, isLoadingSearchResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${searchQuery}&results=${maxHits}`,
    errorMessage: t('feedback.error.search'),
  });

  return (
    <>
      {isLoadingSearchResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">
              {t('central_import.duplicate_search_hits_shown', {
                ShownResultsCount: searchResults.hits.length,
                TotalResultsCount: searchResults.size,
              })}
              :
            </Typography>
            <Divider />
            <List>
              {searchResults.hits.map((publication) => (
                <CentralImportResultItem publication={publication} key={publication.identifier} />
              ))}
            </List>
          </>
        )
      )}
    </>
  );
};
