import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { Registration } from '../../../../types/registration.types';
import { SearchApiPath } from '../../../../api/apiPaths';
import { SearchResponse } from '../../../../types/common.types';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { Divider, List, Typography } from '@mui/material';
import { CentralImportResultItem } from './CentralImportResultItem';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { createSearchQuery, ExpressionStatement, SearchConfig } from '../../../../utils/searchHelpers';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';

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

  //TODO:
  //   issn :  reference.publicationContext.printIssn
  //   issn:  reference.publicationContext.onlineIssn
  //   publication-year?: entityDescription.date.year
  //   contributor: entityDescription.contributors.identity.name
  //   title:  https://api.nva.unit.no/search/resources?from=0&query="tulletittel"+AND+(entityDescription.contributors.identity.name:"tullenavn")

  const searchQuery = createSearchQuery(searchConfig);
  const numberOfResults = ROWS_PER_PAGE_OPTIONS[1];
  const [searchResults, isLoadingSearchResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=${searchQuery}&results=${numberOfResults}`,
    errorMessage: t('feedback:error.search'),
  });

  const publications = searchResults?.hits ?? [];

  return (
    <>
      {isLoadingSearchResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">{t('search:hits', { count: searchResults.size })}:</Typography>
            <Divider />
            <List>
              {publications.map((publication) => (
                <CentralImportResultItem publication={publication} key={publication.identifier} />
              ))}
            </List>
          </>
        )
      )}
    </>
  );
};
