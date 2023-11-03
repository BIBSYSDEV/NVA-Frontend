import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Divider, IconButton, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
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
import { NviApprovalStatuses } from './NviApprovalStatuses';
import { NviCandidateActions } from './NviCandidateActions';

interface NviCandidatePageProps {
  nviListQuery: string;
}

export const NviCandidatePage = ({ nviListQuery }: NviCandidatePageProps) => {
  const { t } = useTranslation();
  const location = useLocation<CandidateOffsetState | undefined>();
  const { identifier } = useParams<IdentifierParams>();

  const offsetNextCandidate = location.state?.offsetNextCandidate;

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

  const nextCandidateQuery = useQuery({
    queryKey: ['nextCandidate', 1, offsetNextCandidate, nviListQuery],
    queryFn: offsetNextCandidate ? () => fetchNviCandidates(1, offsetNextCandidate, nviListQuery) : undefined,
    meta: { errorMessage: false },
    retry: false,
  });

  const nextCandidateIdentifier = nextCandidateQuery.data?.hits[0]?.identifier;

  const offsetNextCandidateState: CandidateOffsetState | undefined = offsetNextCandidate
    ? {
        offsetNextCandidate: offsetNextCandidate + 1,
      }
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

            {nextCandidateIdentifier && offsetNextCandidate && (
              <IconButton
                component={Link}
                to={{
                  pathname: getNviCandidatePath(nextCandidateIdentifier),
                  state: offsetNextCandidateState,
                }}
                data-testid={dataTestId.tasksPage.nvi.nextCandidateButton}
                title={t('tasks.nvi.next_candidate')}
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  gridArea: 'registration',
                  alignSelf: 'center',
                  justifySelf: 'end',
                  right: '-1rem',
                  border: '1px solid',
                  borderColor: 'info.main',
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'white',
                  },
                }}>
                <ArrowForwardIosIcon fontSize="small" color="info" />
              </IconButton>
            )}
          </ErrorBoundary>

          <Paper
            elevation={0}
            sx={{
              gridArea: 'nvi',
              bgcolor: 'nvi.light',
              height: 'fit-content',
              minHeight: '85vh',
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
              undistributedPoints={nviCandidate?.undistributedPoints ?? 0}
            />
          </Paper>
        </ErrorBoundary>
      )}
    </Box>
  );
};
