import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { Registration } from '../../../../types/registration.types';
import { PublicationsApiPath } from '../../../../api/apiPaths';
import { useParams } from 'react-router-dom';
import { SyledPageContent } from '../../../../components/styled/Wrappers';
import { PageSpinner } from '../../../../components/PageSpinner';
import NotFound from '../../../errorpages/NotFound';
import { useEffect } from 'react';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';

export const CentralImportDuplicationCheckPage = () => {
  const { t } = useTranslation('basicData');
  const { identifier } = useParams<{ identifier: string }>();

  const [registration, isLoadingRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback:error.get_registration'),
  });

  useEffect(() => {
    if (stringIncludesMathJax(registration?.entityDescription?.mainTitle)) {
      typesetMathJax();
    }
  }, [registration]);

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('central_import.duplicate_check')}
      </Typography>
      <SyledPageContent>
        {isLoadingRegistration ? (
          <PageSpinner />
        ) : registration ? (
          <>
            <div>Valgt post:</div>
            <div>{registration.id}</div>
          </>
        ) : (
          <NotFound />
        )}
      </SyledPageContent>
    </>
  );
};
