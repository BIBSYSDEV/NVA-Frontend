import { Box, Divider, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { fetchNviCandidate, fetchNviCandidates } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { CandidateOffsetState } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { IdentifierParams, getNviCandidatePath } from '../../../utils/urlPaths';
import { Forbidden } from '../../errorpages/Forbidden';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { NavigationIconButton } from './NavigationIconButton';
import { NviApprovalStatuses } from './NviApprovalStatuses';
import { NviCandidateActions } from './NviCandidateActions';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const location = useLocation<CandidateOffsetState | undefined>();
  const { identifier } = useParams<IdentifierParams>();

  const navigateCandidatesOffset = location.state?.candidateOffset;
  const nviListQuery = location.state?.nviListQuery;
  const isFirstCandidate = navigateCandidatesOffset === 1;
  const candidateOffset = navigateCandidatesOffset && navigateCandidatesOffset - (isFirstCandidate ? 0 : 2);

  const nviCandidateQueryKey = ['nviCandidate', identifier];
  const nviCandidateQuery = useQuery({
    enabled: !!identifier,
    queryKey: nviCandidateQueryKey,
    queryFn: () => fetchNviCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
    retry(failureCount, error: Pick<AxiosError, 'response'>) {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const nviCandidate = nviCandidateQuery.data;
  const registrationIdentifier = getIdentifierFromId(nviCandidate?.publicationId ?? '');

  const registrationQuery = useQuery({
    enabled: !!registrationIdentifier,
    queryKey: ['registration', registrationIdentifier],
    queryFn: () => fetchRegistration(registrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const periodStatus = nviCandidate?.periodStatus.status;

  const navigateCandidateQuery = useQuery({
    queryKey: ['navigateCandidates', 3, candidateOffset, nviListQuery],
    queryFn: () => fetchNviCandidates(3, candidateOffset ?? 0, nviListQuery),
    meta: { errorMessage: false },
    retry: false,
  });

  const nextCandidateIdentifier = navigateCandidateQuery.data?.hits[isFirstCandidate ? 0 : 2]?.identifier;
  const previousCandidateIdentifier =
    navigateCandidatesOffset && navigateCandidatesOffset > 1
      ? navigateCandidateQuery.data?.hits[0]?.identifier
      : undefined;

  return nviCandidateQuery.error?.response?.status === 401 ? (
    <Forbidden />
  ) : registrationQuery.isLoading || nviCandidateQuery.isLoading ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '4fr 1fr' },
        gridTemplateAreas: { xs: '"nvi" "registration"', sm: '"registration nvi"' },
        gap: '1rem',
      }}>
      {registrationQuery.data && (
        <ErrorBoundary>
          <ErrorBoundary>
            <PublicRegistrationContent registration={registrationQuery.data} />

            {previousCandidateIdentifier && navigateCandidatesOffset && (
              <NavigationIconButton
                data-testid={dataTestId.tasksPage.nvi.previousCandidateButton}
                to={{
                  pathname: getNviCandidatePath(previousCandidateIdentifier),
                  state: {
                    candidateOffset: navigateCandidatesOffset - 1,
                    nviListQuery: nviListQuery,
                  },
                }}
                title={t('tasks.nvi.previous_candidate')}
                navigateTo={'previous'}
                sx={{
                  gridArea: 'registration',
                  left: '-1rem',
                }}
              />
            )}

            {nextCandidateIdentifier && navigateCandidatesOffset && (
              <NavigationIconButton
                data-testid={dataTestId.tasksPage.nvi.nextCandidateButton}
                to={{
                  pathname: getNviCandidatePath(nextCandidateIdentifier),
                  state: {
                    candidateOffset: navigateCandidatesOffset + 1,
                    nviListQuery: nviListQuery,
                  },
                }}
                title={t('tasks.nvi.next_candidate')}
                navigateTo={'next'}
                sx={{
                  gridArea: 'registration',
                  right: '-1rem',
                }}
              />
            )}
          </ErrorBoundary>

          <Paper
            elevation={0}
            sx={{
              gridArea: 'nvi',
              bgcolor: 'nvi.light',
              height: 'fit-content',
              minHeight: { sm: '85vh' },
              display: 'flex',
              flexDirection: 'column',
            }}>
            <StyledPaperHeader>
              <Typography color="inherit" variant="h1">
                {t('common.dialogue')}
              </Typography>
            </StyledPaperHeader>

            {periodStatus === 'OpenPeriod' && nviCandidate ? (
              <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
            ) : periodStatus === 'ClosedPeriod' ? (
              <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_closed')}</Typography>
            ) : periodStatus === 'NoPeriod' ? (
              <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_missing')}</Typography>
            ) : null}

            <Divider sx={{ mt: 'auto' }} />
            <NviApprovalStatuses
              approvalStatuses={nviCandidate?.approvalStatuses ?? []}
              totalPoints={nviCandidate?.totalPoints ?? 0}
            />
          </Paper>
        </ErrorBoundary>
      )}
    </Box>
  );
};
