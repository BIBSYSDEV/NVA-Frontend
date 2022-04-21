import { List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../utils/hooks/useFetch';
import { Registration } from '../../../types/registration.types';
import { SearchApiPath } from '../../../api/apiPaths';
import { SearchResponse } from '../../../types/common.types';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';

export const CentralImportPage = () => {
  const { t } = useTranslation('basicData');

  const [results, isLoadingResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}"`,
    errorMessage: t('feedback:error.search'),
  });
  const publications = results?.hits ?? [];
  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('publications')}
      </Typography>
      {isLoadingResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        publications && (
          <>
            {results?.size}
            <List>
              {publications.map((publication, index) => (
                <CentralImportResultItem publication={publication} key={index} />
              ))}
            </List>
          </>
        )
      )}
    </>
  );
};
