import { Box, Button, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { SearchResponse } from '../../../../types/common.types';
import { emptyDuplicateSearchFilter } from '../../../../types/duplicateSearchTypes';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { RegistrationParams, getImportCandidatePagePath } from '../../../../utils/urlPaths';
import NotFound from '../../../errorpages/NotFound';
import { CentralImportDuplicateSearch } from './CentralImportDuplicateSearch';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DuplicateSearchFilterForm } from './DuplicateSearchFilterForm';

export const CentralImportDuplicationCheckPage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const [duplicateSearchFilters, setDuplicateSearchFilters] = useState(emptyDuplicateSearchFilter);

  const importCandidateQuery = useQuery<SearchResponse<ImportCandidateSummary>>({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidates(1, 0, `id:${identifier}`),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });
  const importCandidate = importCandidateQuery.data?.hits[0];

  useEffect(() => {
    if (stringIncludesMathJax(importCandidate?.mainTitle)) {
      typesetMathJax();
    }
  }, [importCandidate]);

  useEffect(() => {
    setDuplicateSearchFilters({
      ...emptyDuplicateSearchFilter,
      doi: importCandidate?.doi ?? '',
    });
  }, [importCandidate]);

  return (
    <>
      <Typography id="duplicate-check-label" variant="h2" gutterBottom>
        {t('basic_data.central_import.duplicate_check')}
      </Typography>
      <>
        {importCandidateQuery.isLoading ? (
          <PageSpinner aria-labelledby="duplicate-check-label" />
        ) : importCandidate ? (
          <>
            {importCandidate && <CentralImportResultItem importCandidate={importCandidate} />}
            <Divider sx={{ marginBottom: '2rem' }} />
            <Typography variant="h3">{t('basic_data.central_import.search_for_duplicates')}:</Typography>
            <DuplicateSearchFilterForm
              importCandidate={importCandidate}
              setDuplicateSearchFilters={setDuplicateSearchFilters}
            />
            <Button variant="outlined" color="primary" component={Link} to={getImportCandidatePagePath(identifier)}>
              {t('basic_data.central_import.import')}
            </Button>
            <Box sx={{ border: '1px solid black', padding: { xs: '0.5rem', sm: '0.5rem 2rem' }, mt: '1rem' }}>
              <CentralImportDuplicateSearch duplicateSearchFilters={duplicateSearchFilters} />
            </Box>
          </>
        ) : (
          <NotFound />
        )}
      </>
    </>
  );
};
