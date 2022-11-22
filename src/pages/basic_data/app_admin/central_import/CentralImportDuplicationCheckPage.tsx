import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { Registration } from '../../../../types/registration.types';
import { PublicationsApiPath } from '../../../../api/apiPaths';
import { SyledPageContent } from '../../../../components/styled/Wrappers';
import { PageSpinner } from '../../../../components/PageSpinner';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { CentralImportDuplicateSearch } from './CentralImportDuplicateSearch';
import NotFound from '../../../errorpages/NotFound';
import { DuplicateSearchFilterForm } from './DuplicateSearchFilterForm';
import { emptyDuplicateSearchFilter } from '../../../../types/duplicateSearchTypes';
import { getTitleString } from '../../../../utils/registration-helpers';
import { RegistrationParams } from '../../../../utils/urlPaths';

export const CentralImportDuplicationCheckPage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const [duplicateSearchFilters, setDuplicateSearchFilters] = useState(emptyDuplicateSearchFilter);

  const [registration, isLoadingRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback.error.get_registration'),
  });

  useEffect(() => {
    if (stringIncludesMathJax(registration?.entityDescription?.mainTitle)) {
      typesetMathJax();
    }
  }, [registration]);

  useEffect(() => {
    setDuplicateSearchFilters({
      ...emptyDuplicateSearchFilter,
      doi: registration?.entityDescription?.reference?.doi ?? '',
    });
  }, [registration]);

  const contributors = registration?.entityDescription?.contributors ?? [];

  return (
    <>
      <Typography id="duplicate-check-label" variant="h3" component="h2" paragraph>
        {t('basic_data.central_import.duplicate_check')}
      </Typography>
      <SyledPageContent>
        {isLoadingRegistration ? (
          <PageSpinner aria-labelledby="duplicate-check-label" />
        ) : registration ? (
          <>
            <Typography variant="h3" component="h2" paragraph>
              {t('basic_data.central_import.import_publication')}:
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
              {getTitleString(registration.entityDescription?.mainTitle)}
            </Typography>
            <Typography display="inline" variant="body2">
              {contributors.map((contributor) => contributor.identity.name).join('; ')}
            </Typography>
            {registration.entityDescription?.reference?.doi && (
              <MuiLink
                underline="hover"
                href={registration.entityDescription.reference.doi}
                target="_blank"
                rel="noopener noreferrer">
                <Typography gutterBottom variant="body2" sx={{ color: 'primary.main' }}>
                  {registration.entityDescription.reference.doi}
                </Typography>
              </MuiLink>
            )}
            <Divider sx={{ marginBottom: '2rem' }} />
            <Typography variant="h3" component="h2" paragraph>
              {t('basic_data.central_import.search_for_duplicates')}:
            </Typography>
            <DuplicateSearchFilterForm
              publication={registration}
              setDuplicateSearchFilters={setDuplicateSearchFilters}
            />
            <Box sx={{ border: '1px solid black', padding: { xs: '0.5rem', sm: '0.5rem 2rem' } }}>
              <CentralImportDuplicateSearch duplicateSearchFilters={duplicateSearchFilters} />
            </Box>
          </>
        ) : (
          <NotFound />
        )}
      </SyledPageContent>
    </>
  );
};
