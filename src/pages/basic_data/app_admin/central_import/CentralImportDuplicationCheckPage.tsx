import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchRegistration, updateImportCandidateStatus } from '../../../../api/registrationApi';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../../components/PageWithSideMenu';
import { RegistrationListItemContent } from '../../../../components/RegistrationList';
import { BackgroundDiv, SearchListItem } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/notificationSlice';
import { emptyDuplicateSearchFilter } from '../../../../types/duplicateSearchTypes';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import {
  IdentifierParams,
  UrlPathTemplate,
  getImportCandidateMergePath,
  getImportCandidateWizardPath,
} from '../../../../utils/urlPaths';
import NotFound from '../../../errorpages/NotFound';
import { CentralImportDuplicateSearch } from './CentralImportDuplicateSearch';
import { CentralImportResultItem } from './CentralImportResultItem';
import { DuplicateSearchFilterForm } from './DuplicateSearchFilterForm';

export const CentralImportDuplicationCheckPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();
  const [duplicateSearchFilters, setDuplicateSearchFilters] = useState(emptyDuplicateSearchFilter);
  const [registrationIdentifier, setRegistrationIdentifier] = useState('');

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidateSearch', identifier],
    queryFn: () => fetchImportCandidates(1, 0, `id:${identifier}`),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });
  const importCandidate = importCandidateQuery.data?.hits[0];

  const importCandidateStatusMutation = useMutation({
    mutationFn: () => updateImportCandidateStatus(identifier, { candidateStatus: 'NOT_APPLICABLE' }),
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.update_import_status'),
          variant: 'error',
        })
      ),
  });

  const importedRegistrationQuery = useQuery({
    enabled:
      importCandidate?.importStatus.candidateStatus === 'IMPORTED' && !!importCandidate.importStatus.nvaPublicationId,
    queryFn: () => fetchRegistration(getIdentifierFromId(importCandidate?.importStatus.nvaPublicationId ?? '')),
    meta: { errorMessage: t('feedback.error.get_registration') },
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
            <Typography variant="h1" sx={{ mt: '1rem' }} gutterBottom>
              {t('basic_data.central_import.import_candidate')}:
            </Typography>
            <CentralImportResultItem importCandidate={importCandidate} />

            {importCandidate.importStatus.candidateStatus !== 'IMPORTED' ? (
              <>
                <Typography variant="h3" sx={{ mt: '1rem' }}>
                  {t('basic_data.central_import.search_for_duplicates')}:
                </Typography>
                <DuplicateSearchFilterForm
                  importCandidate={importCandidate}
                  setDuplicateSearchFilters={setDuplicateSearchFilters}
                />
                <CentralImportDuplicateSearch
                  duplicateSearchFilters={duplicateSearchFilters}
                  registrationIdentifier={registrationIdentifier}
                  setRegistrationIdentifier={setRegistrationIdentifier}
                />
              </>
            ) : (
              <>
                <Typography variant="h1" sx={{ mt: '1rem' }} gutterBottom>
                  {t('basic_data.central_import.merge_candidate.result_in_nva')}:
                </Typography>
                {importedRegistrationQuery.data && (
                  <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
                    <RegistrationListItemContent registration={importedRegistrationQuery.data} />
                  </SearchListItem>
                )}
              </>
            )}
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
              {importCandidate.importStatus.modifiedDate && (
                <Typography>
                  {t('common.date')}: {new Date(importCandidate.importStatus.modifiedDate).toLocaleString()}
                </Typography>
              )}
            </>
          )}
          {importCandidate?.importStatus.candidateStatus === 'NOT_APPLICABLE' && (
            <>
              <Typography>{t('basic_data.central_import.import_not_applicable')}</Typography>
              {importCandidate.importStatus.modifiedDate && (
                <Typography>
                  {t('common.date')}: {new Date(importCandidate.importStatus.modifiedDate).toLocaleString()}
                </Typography>
              )}
            </>
          )}

          {importCandidate?.importStatus.candidateStatus === 'NOT_IMPORTED' && (
            <>
              {!importCandidateStatusMutation.isSuccess ? (
                <>
                  <Typography gutterBottom>
                    {t('basic_data.central_import.create_publication_from_import_candidate')}
                  </Typography>

                  <Link to={getImportCandidateWizardPath(identifier)}>
                    <Button variant="outlined" fullWidth size="small">
                      {t('basic_data.central_import.create_new')}
                    </Button>
                  </Link>

                  <Divider sx={{ my: '1rem' }} />

                  <Typography gutterBottom>
                    {t('basic_data.central_import.merge_candidate.merge_description')}
                  </Typography>
                  {registrationIdentifier ? (
                    <Link to={getImportCandidateMergePath(identifier, registrationIdentifier)}>
                      <Button variant="outlined" fullWidth size="small">
                        {t('basic_data.central_import.merge_candidate.merge')}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outlined" fullWidth size="small" disabled>
                      {t('basic_data.central_import.merge_candidate.merge')}
                    </Button>
                  )}

                  <Divider sx={{ my: '1rem' }} />

                  <Typography gutterBottom>{t('basic_data.central_import.mark_as_not_applicable')}</Typography>
                  <LoadingButton
                    variant="outlined"
                    fullWidth
                    size="small"
                    loading={importCandidateStatusMutation.isLoading}
                    onClick={() => importCandidateStatusMutation.mutate()}>
                    {t('basic_data.central_import.not_applicable')}
                  </LoadingButton>
                </>
              ) : importCandidateStatusMutation.isSuccess ? (
                <Typography>{t('basic_data.central_import.import_not_applicable')}</Typography>
              ) : null}
            </>
          )}

          <Divider sx={{ my: '1rem' }} />
          <Link to={UrlPathTemplate.BasicDataCentralImport}>
            <Button size="small" fullWidth variant="outlined">
              {t('common.cancel')}
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};
