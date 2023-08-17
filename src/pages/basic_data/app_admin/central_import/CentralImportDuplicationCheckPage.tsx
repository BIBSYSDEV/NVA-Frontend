import { LoadingButton } from '@mui/lab';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/notificationSlice';
import { SearchResponse } from '../../../../types/common.types';
import { emptyDuplicateSearchFilter } from '../../../../types/duplicateSearchTypes';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { RegistrationParams, getRegistrationLandingPagePath } from '../../../../utils/urlPaths';
import NotFound from '../../../errorpages/NotFound';
import { CentralImportDuplicateSearch } from './CentralImportDuplicateSearch';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DuplicateSearchFilterForm } from './DuplicateSearchFilterForm';

export const CentralImportDuplicationCheckPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<RegistrationParams>();
  const [duplicateSearchFilters, setDuplicateSearchFilters] = useState(emptyDuplicateSearchFilter);

  const importCandidateQuery = useQuery<SearchResponse<ImportCandidateSummary>>({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidates(1, 0, `id:${identifier}`),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });
  const importCandidate = importCandidateQuery.data?.hits[0];

  const importCandidateMutation = useMutation({
    mutationFn: async () => {
      const initialDataRegistration = await fetchImportCandidate(identifier);
      return await createRegistrationFromImportCandidate(initialDataRegistration);
    },
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.create_registration'),
          variant: 'success',
        })
      );
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.create_registration'),
          variant: 'error',
        })
      ),
  });

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
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
        gridTemplateAreas: { xs: '"actions" "main"', sm: '"main actions"' },
        gap: '1rem',
      }}>
      <BackgroundDiv>
        {importCandidateQuery.isLoading ? (
          <PageSpinner aria-label={t('basic_data.central_import.central_import')} />
        ) : importCandidate ? (
          <>
            {importCandidate && <CentralImportResultItem importCandidate={importCandidate} />}
            <Typography variant="h3" sx={{ mt: '1rem' }}>
              {t('basic_data.central_import.search_for_duplicates')}:
            </Typography>
            <DuplicateSearchFilterForm
              importCandidate={importCandidate}
              setDuplicateSearchFilters={setDuplicateSearchFilters}
            />
            <CentralImportDuplicateSearch duplicateSearchFilters={duplicateSearchFilters} />
          </>
        ) : (
          <NotFound />
        )}
      </BackgroundDiv>

      <Paper elevation={0} sx={{ gridArea: 'actions' }}>
        <StyledPaperHeader>
          <Typography color="inherit" variant="h1">
            {t('common.dialogue')}
          </Typography>
        </StyledPaperHeader>

        <Box sx={{ m: '0.5rem' }}>
          {importCandidate?.importStatus.candidateStatus === 'IMPORTED' && (
            <>
              <Typography>{t('basic_data.central_import.import_completed')}</Typography>
              <Typography>
                {t('common.date')}: {new Date(importCandidate.importStatus.modifiedDate).toLocaleString()}
              </Typography>
            </>
          )}

          {importCandidate?.importStatus.candidateStatus === 'NOT_IMPORTED' &&
            (!importCandidateMutation.isSuccess ? (
              <>
                <Typography gutterBottom>
                  {t('basic_data.central_import.create_publication_from_import_candidate')}
                </Typography>

                <LoadingButton
                  variant="outlined"
                  fullWidth
                  size="small"
                  color="primary"
                  disabled={importCandidateMutation.isSuccess}
                  loading={importCandidateMutation.isLoading}
                  onClick={() => importCandidateMutation.mutate()}>
                  {t('basic_data.central_import.create_new')}
                </LoadingButton>
              </>
            ) : (
              <>
                <Typography gutterBottom>{t('basic_data.central_import.import_completed')}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={getRegistrationLandingPagePath(importCandidateMutation.data.identifier)}>
                  {t('basic_data.central_import.see_publication')}
                </Button>
              </>
            ))}
        </Box>
      </Paper>
    </Box>
  );
};
