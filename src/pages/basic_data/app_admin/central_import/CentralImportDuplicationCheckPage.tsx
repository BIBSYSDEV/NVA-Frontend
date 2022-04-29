import { Link as MuiLink, Typography } from '@mui/material';
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

  const contributors = registration?.entityDescription?.contributors ?? [];

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
            <Typography variant="h3" component="h2" paragraph>
              {t('central_import.import_publication')}:
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
              {registration.entityDescription?.mainTitle}
            </Typography>
            {contributors && (
              <Typography display="inline" variant="body2">
                {contributors.map((contributor) => contributor.identity.name).join('; ')}
              </Typography>
            )}
            {registration.entityDescription?.reference?.doi && (
              <MuiLink
                underline="hover"
                href={registration.entityDescription.reference.doi}
                target="_blank"
                rel="noopener noreferrer">
                <Typography gutterBottom variant="body2" sx={{ color: 'primary.dark' }}>
                  {registration.entityDescription.reference.doi}
                </Typography>
              </MuiLink>
            )}
          </>
        ) : (
          <NotFound />
        )}
      </SyledPageContent>
    </>
  );
};
