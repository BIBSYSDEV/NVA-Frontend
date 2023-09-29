import { Box, Divider, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { NviApprovalStatuses } from './NviApprovalStatuses';
import { NviCandidateActions } from './NviCandidateActions';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  const nviCandidateQueryKey = ['nviCandidate', identifier];
  const nviCandidateQuery = useQuery({
    enabled: !!identifier,
    queryKey: nviCandidateQueryKey,
    queryFn: () => fetchNviCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
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

  return registrationQuery.isLoading || nviCandidateQuery.isLoading ? (
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
            <NviApprovalStatuses approvalStatuses={nviCandidate?.approvalStatuses ?? []} />
          </Paper>
        </ErrorBoundary>
      )}
    </Box>
  );
};
