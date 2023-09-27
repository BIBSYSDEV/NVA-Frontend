import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Paper, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrganization } from '../../../api/cristinApi';
import { fetchRegistration } from '../../../api/registrationApi';
import {
  CreateNoteData,
  SetNviCandidateStatusData,
  createNote,
  deleteCandidateNote,
  setCandidateAssignee,
  setCandidateStatus,
} from '../../../api/scientificIndexApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { MessageForm } from '../../../components/MessageForm';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { PublicationPointsTypography } from '../../../components/PublicationPointsTypography';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { ApprovalStatus, FinalizedApprovalStatus, RejectedApprovalStatus } from '../../../types/nvi.types';
import { RoleName } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { MessageItem } from './MessageList';

interface NviNote {
  type: 'FinalizedNote' | 'GeneralNote';
  identifier?: string;
  date: string;
  username: string;
  content: ReactNode;
}

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();
  const user = useSelector((store: RootState) => store.user);
  const [hasSelectedRejectCandidate, setHasSelectedRejectCandidate] = useState(false);

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

  const createNoteMutation = useMutation({
    mutationFn: async (note: CreateNoteData) => {
      const updatedCandidate = await createNote(identifier, note);
      queryClient.setQueryData(nviCandidateQueryKey, updatedCandidate);
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.create_note'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_note'), variant: 'error' })),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteIdentifier: string) => {
      if (nviCandidate && noteIdentifier) {
        const deleteNoteResponse = await deleteCandidateNote(nviCandidate.id, noteIdentifier);
        queryClient.setQueryData(nviCandidateQueryKey, deleteNoteResponse);
      }
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.delete_note'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_note'), variant: 'error' })),
  });

  const statusMutation = useMutation({
    mutationFn: async (data: Omit<SetNviCandidateStatusData, 'institutionId'>) => {
      if (myApprovalStatus) {
        const updatedCandidate = await setCandidateStatus(identifier, {
          ...data,
          institutionId: myApprovalStatus.institutionId,
        });
        queryClient.setQueryData(nviCandidateQueryKey, updatedCandidate);
      }
    },
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_nvi_status'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_nvi_status'), variant: 'error' })),
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

  const isMutating = createNoteMutation.isLoading || statusMutation.isLoading;

  const rejectionNotes: NviNote[] = (
    (nviCandidate?.approvalStatuses.filter((status) => status.status === 'Rejected') ?? []) as RejectedApprovalStatus[]
  ).map((rejectionStatus) => ({
    type: 'FinalizedNote',
    date: rejectionStatus.finalizedDate,
    content: (
      <Typography>
        <Box component="span" fontWeight={700}>
          {t('tasks.nvi.status.Rejected')}:
        </Box>{' '}
        {rejectionStatus.reason}
      </Typography>
    ),
    username: rejectionStatus.finalizedBy,
  }));

  const approvalNotes: NviNote[] = (
    (nviCandidate?.approvalStatuses.filter((status) => status.status === 'Approved') ?? []) as FinalizedApprovalStatus[]
  ).map((approvalStatus) => ({
    type: 'FinalizedNote',
    date: approvalStatus.finalizedDate,
    content: <Typography fontWeight={700}>{t('tasks.nvi.status.Approved')}</Typography>,
    username: approvalStatus.finalizedBy,
  }));

  const generalNotes: NviNote[] = (nviCandidate?.notes ?? []).map((note) => ({
    type: 'GeneralNote',
    identifier: note.identifier,
    date: note.createdDate,
    content: note.text,
    username: note.user,
  }));

  const allNotes = [...generalNotes, ...rejectionNotes, ...approvalNotes];

  const sortedNotes = allNotes.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const publicationPointsSum = nviCandidate?.approvalStatuses.reduce((acc, status) => acc + status.points, 0);

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

            <Box sx={{ m: '1rem' }}>
              {sortedNotes.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'none',
                    p: 0,
                    m: '0 0 1rem 0',
                    gap: '0.25rem',
                  }}>
                  {sortedNotes.map((note) => {
                    let deleteFunction: (() => void) | undefined = undefined;

                    if (user?.nvaUsername && note.username === user.nvaUsername) {
                      if (note.type === 'FinalizedNote') {
                        deleteFunction = () => statusMutation.mutate({ status: 'Pending' });
                      } else if (note.type === 'GeneralNote' && note.identifier) {
                        deleteFunction = () => deleteNoteMutation.mutate(note.identifier ?? '');
                      }
                    }

                    const isDeleting =
                      (statusMutation.isLoading && statusMutation.variables?.status === 'Pending') ||
                      (deleteNoteMutation.isLoading && deleteNoteMutation.variables === note.identifier);

                    return (
                      <ErrorBoundary key={note.identifier ?? note.date}>
                        <MessageItem
                          text={note.content}
                          date={note.date}
                          username={note.username}
                          backgroundColor="nvi.main"
                          onDelete={deleteFunction}
                          isDeleting={isDeleting}
                        />
                      </ErrorBoundary>
                    );
                  })}
                </Box>
              )}

              {myApprovalStatus?.status !== 'Approved' && (
                <>
                  <Typography gutterBottom>{t('tasks.nvi.approve_nvi_candidate_description')}</Typography>
                  <LoadingButton
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ mb: '1rem' }}
                    loading={statusMutation.isLoading && statusMutation.variables?.status === 'Approved'}
                    disabled={isMutating}
                    onClick={() => statusMutation.mutate({ status: 'Approved' })}>
                    {t('tasks.nvi.approve_nvi_candidate')}
                  </LoadingButton>
                </>
              )}

              {myApprovalStatus?.status !== 'Rejected' && (
                <>
                  <Typography gutterBottom>{t('tasks.nvi.reject_nvi_candidate_description')}</Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ mb: '1rem' }}
                    disabled={isMutating || hasSelectedRejectCandidate}
                    onClick={() => setHasSelectedRejectCandidate(true)}>
                    {t('tasks.nvi.reject_nvi_candidate')}
                  </Button>

                  {hasSelectedRejectCandidate && (
                    <MessageForm
                      confirmAction={async (reason) => {
                        await statusMutation.mutateAsync({ status: 'Rejected', reason });
                        setHasSelectedRejectCandidate(false);
                      }}
                      cancelAction={() => setHasSelectedRejectCandidate(false)}
                      fieldLabel={t('tasks.nvi.reject_nvi_candidate_form_label')}
                      buttonTitle={t('tasks.nvi.reject_nvi_candidate')}
                    />
                  )}
                </>
              )}

              {!hasSelectedRejectCandidate && (
                <MessageForm
                  confirmAction={async (text) => {
                    await createNoteMutation.mutateAsync({ text });
                  }}
                  fieldLabel={t('tasks.nvi.note')}
                  buttonTitle={t('tasks.nvi.save_note')}
                />
              )}
            </Box>

            <Divider sx={{ mt: 'auto' }} />
            <Box sx={{ m: '1rem' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  mb: '0.5rem',
                }}>
                <Typography>{t('tasks.nvi.publication_points')}</Typography>
                {publicationPointsSum && <PublicationPointsTypography points={publicationPointsSum} />}
              </Box>

              {nviCandidate && nviCandidate.approvalStatuses.length > 0 && (
                <Paper
                  sx={{
                    bgcolor: 'nvi.light',
                    p: '0.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, auto)',
                    gap: '0.5rem 0.75rem',
                    alignItems: 'center',
                  }}>
                  {nviCandidate.approvalStatuses.map((approvalStatus) => (
                    <InstitutionApprovalStatusRow key={approvalStatus.institutionId} approvalStatus={approvalStatus} />
                  ))}
                </Paper>
              )}
            </Box>
          </Paper>
        </ErrorBoundary>
      )}
    </Box>
  );
};

interface InstitutionApprovalStatusRowProps {
  approvalStatus: ApprovalStatus;
}

const InstitutionApprovalStatusRow = ({ approvalStatus }: InstitutionApprovalStatusRowProps) => {
  const { t } = useTranslation();

  const institutionQuery = useQuery({
    queryKey: [approvalStatus.institutionId],
    queryFn: () => fetchOrganization(approvalStatus.institutionId),
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  return (
    <>
      {institutionQuery.isLoading ? (
        <Skeleton sx={{ width: '8rem' }} />
      ) : (
        <Typography>{getLanguageString(institutionQuery.data?.labels)}</Typography>
      )}
      <Typography sx={{ whiteSpace: 'nowrap' }}>{t(`tasks.nvi.status.${approvalStatus.status}`)}</Typography>
      <PublicationPointsTypography sx={{ whiteSpace: 'nowrap' }} points={approvalStatus.points} />
    </>
  );
};
