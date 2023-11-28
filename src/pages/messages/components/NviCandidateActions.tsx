import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateNoteData,
  SetNviCandidateStatusData,
  createNote,
  deleteCandidateNote,
  setCandidateAssignee,
  setCandidateStatus,
} from '../../../api/scientificIndexApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { MessageForm } from '../../../components/MessageForm';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FinalizedApprovalStatus, NviCandidate, RejectedApprovalStatus } from '../../../types/nvi.types';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { MessageItem } from './MessageList';

interface NviNote {
  type: 'FinalizedNote' | 'GeneralNote';
  identifier?: string;
  date: string;
  username: string;
  content: ReactNode;
}

interface NviCandidateActionsProps {
  nviCandidate: NviCandidate;
  nviCandidateQueryKey: string[];
}

export const NviCandidateActions = ({ nviCandidate, nviCandidateQueryKey }: NviCandidateActionsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const candidateIdentifier = getIdentifierFromId(nviCandidate.id);

  const [hasSelectedRejectCandidate, setHasSelectedRejectCandidate] = useState(false);

  const queryClient = useQueryClient();

  const assigneeMutation = useMutation({
    mutationFn: async (assignee: string) => {
      if (myApprovalStatus) {
        const updatedCandidate = await setCandidateAssignee(candidateIdentifier, {
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

  const createNoteMutation = useMutation({
    mutationFn: async (note: CreateNoteData) => {
      const updatedCandidate = await createNote(candidateIdentifier, note);
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

  const myApprovalStatus = nviCandidate?.approvals.find((status) => status.institutionId === user?.topOrgCristinId);

  const statusMutation = useMutation({
    mutationFn: async (data: Omit<SetNviCandidateStatusData, 'institutionId'>) => {
      if (myApprovalStatus) {
        const updatedCandidate = await setCandidateStatus(candidateIdentifier, {
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

  const isMutating = createNoteMutation.isLoading || statusMutation.isLoading;

  const rejectionNotes: NviNote[] = (
    (nviCandidate?.approvals.filter((status) => status.status === 'Rejected') ?? []) as RejectedApprovalStatus[]
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
    (nviCandidate?.approvals.filter((status) => status.status === 'Approved') ?? []) as FinalizedApprovalStatus[]
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

  const sortedNotes = [...generalNotes, ...rejectionNotes, ...approvalNotes].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
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
              const noteIdentifier = note.identifier;

              if (user?.nvaUsername && note.username === user.nvaUsername) {
                if (note.type === 'FinalizedNote') {
                  deleteFunction = () => statusMutation.mutate({ status: 'Pending' });
                } else if (note.type === 'GeneralNote' && noteIdentifier) {
                  deleteFunction = () => deleteNoteMutation.mutate(noteIdentifier);
                }
              }

              const isDeleting =
                (statusMutation.isLoading && statusMutation.variables?.status === 'Pending') ||
                (deleteNoteMutation.isLoading && deleteNoteMutation.variables === noteIdentifier);

              return (
                <ErrorBoundary key={noteIdentifier ?? note.date}>
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
              data-testid={dataTestId.tasksPage.nvi.approveButton}
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
              data-testid={dataTestId.tasksPage.nvi.rejectButton}
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
            confirmAction={async (text) => await createNoteMutation.mutateAsync({ text })}
            fieldLabel={t('tasks.nvi.note')}
            buttonTitle={t('tasks.nvi.save_note')}
          />
        )}
      </Box>
    </>
  );
};
