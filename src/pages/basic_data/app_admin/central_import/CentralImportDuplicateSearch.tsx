import { Divider, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { Registration } from '../../../../types/registration.types';
import { SearchApiPath } from '../../../../api/apiPaths';
import { SearchResponse } from '../../../../types/common.types';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { createSearchQuery, ExpressionStatement, SearchConfig } from '../../../../utils/searchHelpers';

const RESULTS_TO_SHOW = 5;

interface CentralImportDuplicateSearchProps {
  publication: Registration;
}

export const CentralImportDuplicateSearch = ({ publication }: CentralImportDuplicateSearchProps) => {
  const { t } = useTranslation('basicData');

  const searchConfig: SearchConfig = publication.entityDescription?.reference?.doi
    ? {
        properties: [
          {
            fieldName: ResourceFieldNames.Doi,
            value: publication.entityDescription.reference.doi,
            operator: ExpressionStatement.Contains,
          },
        ],
      }
    : {};

  const searchQuery = createSearchQuery(searchConfig);
  const numberOfResults = ROWS_PER_PAGE_OPTIONS[1];
  const [searchResults, isLoadingSearchResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=${searchQuery}&results=${numberOfResults}`,
    errorMessage: t('feedback:error.search'),
  });

  return (
    <>
      {isLoadingSearchResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            {/* TODO: fjern indexen */}
            <Typography variant="subtitle1">
              {t('central_import.duplicate_search_hits_shown', {
                ShownResultsCount: RESULTS_TO_SHOW,
                TotalResultsCount: searchResults.size,
              })}
              :
            </Typography>
            <Divider />
            <List>
              {searchResults.hits.map((publication, index) => (
                <CentralImportResultItem publication={publication} key={publication.identifier + index} />
              ))}
            </List>
          </>
        )
      )}
    </>
  );
};
