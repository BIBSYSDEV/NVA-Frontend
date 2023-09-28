import { Box, Divider, Paper, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { setCandidateAssignee } from '../../../api/scientificIndexApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { RoleName } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { NviApprovalStatuses } from './NviApprovalStatuses';
import { NviCandidateActions } from './NviCandidateActions';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();
  const user = useSelector((store: RootState) => store.user);

  const queryClient = useQueryClient();

  const nviCandidateQueryKey = ['nviCandidate', identifier];
  const nviCandidateQuery = useQuery({
    enabled: !!identifier,
    queryKey: nviCandidateQueryKey,
    queryFn: () => fetchNviCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
  });
  const nviCandidate = nviCandidateQuery.data;
  const myApprovalStatus = nviCandidate?.approvalStatuses.find(
    (status) => status.institutionId === user?.topOrgCristinId
  );
  const registrationIdentifier = getIdentifierFromId(nviCandidate?.publicationId ?? '');

  const registrationQuery = useQuery({
    enabled: !!registrationIdentifier,
    queryKey: ['registration', registrationIdentifier],
    queryFn: () => fetchRegistration(registrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const assigneeMutation = useMutation({
    mutationFn: async (assignee: string) => {
      if (myApprovalStatus) {
        const updatedCandidate = await setCandidateAssignee(identifier, {
          institutionId: myApprovalStatus.institutionId,
          assignee,
        });
        queryClient.setQueryData(nviCandidateQueryKey, updatedCandidate);
      }
    },
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_ticket_assignee'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
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

            {(periodStatus === 'OpenPeriod' || periodStatus === 'NoPeriod') && (
              <>
                <Box sx={{ m: '1rem' }}>
                  <AssigneeSelector
                    assignee={myApprovalStatus?.assignee}
                    canSetAssignee={myApprovalStatus?.status === 'Pending'}
                    onSelectAssignee={async (assigee) => await assigneeMutation.mutateAsync(assigee)}
                    isUpdating={assigneeMutation.isLoading}
                    roleFilter={RoleName.NviCurator}
                    iconBackgroundColor="nvi.main"
                  />
                </Box>
                <Divider />
              </>
            )}

            {periodStatus === 'ClosedPeriod' && (
              <Typography>Rapporteringsperioden er lukket for dette resultatet.</Typography>
            )}

            {periodStatus === 'NoPeriod' && (
              <Typography>Rapporteringsperioden er ikke åpnet enda for dette resultatet.</Typography>
            )}

            {periodStatus === 'OpenPeriod' && nviCandidate && (
              <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
            )}

            <Divider sx={{ mt: 'auto' }} />
            <NviApprovalStatuses approvalStatuses={nviCandidate?.approvalStatuses ?? []} />
          </Paper>
        </ErrorBoundary>
      )}
    </Box>
  );
};
