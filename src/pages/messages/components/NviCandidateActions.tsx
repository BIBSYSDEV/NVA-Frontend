import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import {
  createNote,
  CreateNoteData,
  deleteCandidateNote,
  setCandidateAssignee,
  setCandidateStatus,
  SetNviCandidateStatusData,
} from '../../../api/scientificIndexApi';
import { AssigneeSelector } from '../../../components/AssigneeSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { MessageForm } from '../../../components/MessageForm';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { PreviousPathLocationState } from '../../../types/locationState.types';
import { FinalizedApproval, NviCandidate, RejectedApproval } from '../../../types/nvi.types';
import { RegistrationTab } from '../../../types/registration.types';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { hasUnidentifiedContributorProblem } from '../../../utils/nviHelpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { MessageItem } from './MessageList';
import { NviCandidateRejectionDialog } from './NviCandidateRejectionDialog';
import { NviNoteMenu } from './NviNoteMenu';

interface NviNote {
  type: 'FinalizedNote' | 'GeneralNote';
  identifier?: string;
  date: string;
  username: string;
  institutionId?: string;
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
      if (myApproval) {
        const updatedCandidate = await setCandidateAssignee(candidateIdentifier, {
          institutionId: myApproval.institutionId,
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
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.delete_message'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_message'), variant: 'error' })),
  });

  const myApproval = nviCandidate?.approvals.find((status) => status.institutionId === user?.topOrgCristinId);

  const statusMutation = useMutation({
    mutationFn: async (data: Omit<SetNviCandidateStatusData, 'institutionId'>) => {
      if (myApproval) {
        const updatedCandidate = await setCandidateStatus(candidateIdentifier, {
          ...data,
          institutionId: myApproval.institutionId,
        });
        queryClient.setQueryData(nviCandidateQueryKey, updatedCandidate);
      }
    },
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_nvi_status'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_nvi_status'), variant: 'error' })),
  });

  const isMutating = createNoteMutation.isPending || statusMutation.isPending;

  const rejectionNotes: NviNote[] = (
    (nviCandidate?.approvals.filter((status) => status.status === 'Rejected') ?? []) as RejectedApproval[]
  ).map((rejectionStatus) => ({
    type: 'FinalizedNote',
    date: rejectionStatus.finalizedDate,
    content: (
      <Typography>
        <Box component="span" fontWeight={700} sx={{ textDecoration: 'underline' }}>
          {t('tasks.nvi.rejection_reason')}:
        </Box>
        <br />
        {rejectionStatus.reason}
      </Typography>
    ),
    username: rejectionStatus.finalizedBy,
    institutionId: rejectionStatus.institutionId,
  }));

  const approvalNotes: NviNote[] = (
    (nviCandidate?.approvals.filter((status) => status.status === 'Approved') ?? []) as FinalizedApproval[]
  ).map((approvalStatus) => ({
    type: 'FinalizedNote',
    date: approvalStatus.finalizedDate,
    content: <Typography fontWeight={700}>{t('tasks.nvi.status.Approved')}</Typography>,
    username: approvalStatus.finalizedBy,
    institutionId: approvalStatus.institutionId,
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
    return dateA.getTime() - dateB.getTime();
  });

  const canApproveCandidate = nviCandidate.allowedOperations.includes('approval/approve-candidate');
  const canRejectCandidate = nviCandidate.allowedOperations.includes('approval/reject-candidate');
  const canResetApproval = nviCandidate.allowedOperations.includes('approval/reset-approval');
  const canCreateNote = nviCandidate.allowedOperations.includes('note/create-note');

  return (
    <>
      <Box sx={{ gridArea: 'curator' }}>
        <AssigneeSelector
          assignee={myApproval?.assignee}
          canSetAssignee={myApproval?.status === 'New' || myApproval?.status === 'Pending'}
          onSelectAssignee={async (assignee) => await assigneeMutation.mutateAsync(assignee)}
          isUpdating={assigneeMutation.isPending}
          roleFilter={RoleName.NviCurator}
        />
      </Box>

      {hasUnidentifiedContributorProblem(nviCandidate.problems) && (
        <>
          <Divider sx={{ gridArea: 'divider0' }} />
          <Box sx={{ gridArea: 'problem' }}>
            <Trans
              i18nKey="tasks.nvi.problem_description"
              components={{
                p: <Typography gutterBottom />,
                ul: <Box component="ul" sx={{ mt: 0, mb: '0.5rem', pl: '2rem' }} />,
                li: <li />,
              }}
            />

            <Button
              sx={{ bgcolor: 'primary.light' }}
              variant="contained"
              fullWidth
              size="small"
              data-testid={dataTestId.tasksPage.nvi.editResultButton}
              endIcon={<EditIcon />}
              component={RouterLink}
              state={{ previousPath: window.location.pathname } satisfies PreviousPathLocationState}
              to={getRegistrationWizardPath(getIdentifierFromId(nviCandidate.publicationId), {
                tab: RegistrationTab.Contributors,
              })}>
              {t('registration.edit_registration')}
            </Button>
          </Box>
        </>
      )}

      <Divider sx={{ gridArea: 'divider1' }} />

      <Box sx={{ gridArea: 'actions' }}>
        {myApproval && myApproval.status !== 'Approved' && (
          <>
            {myApproval.status === 'Rejected' ? (
              <Typography sx={{ mb: '1rem' }}>
                {t('tasks.nvi.approve_rejected_nvi_candidate_description', {
                  buttonText: t('tasks.nvi.approve_nvi_candidate'),
                })}
              </Typography>
            ) : (
              <Trans
                i18nKey="tasks.nvi.approve_nvi_candidate_description"
                components={{
                  p: <Typography sx={{ mb: '1rem' }} />,
                  hyperlink: (
                    <OpenInNewLink
                      href="https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva/NVI-rapporteringsinstruks"
                      sx={{ fontStyle: 'italic' }}
                    />
                  ),
                }}
                values={{ buttonText: t('tasks.nvi.approve_nvi_candidate') }}
              />
            )}

            <Button
              data-testid={dataTestId.tasksPage.nvi.approveButton}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: '1rem', bgcolor: 'white' }}
              loading={statusMutation.isPending && statusMutation.variables?.status === 'Approved'}
              disabled={!canApproveCandidate || isMutating}
              endIcon={<CheckIcon />}
              loadingPosition="end"
              onClick={() => statusMutation.mutate({ status: 'Approved' })}>
              {t('tasks.nvi.approve_nvi_candidate')}
            </Button>
          </>
        )}

        {myApproval && myApproval.status !== 'Rejected' && (
          <>
            <Typography sx={{ mb: '1rem' }}>
              {t('tasks.nvi.reject_nvi_candidate_description', { buttonText: t('tasks.nvi.reject_nvi_candidate') })}
            </Typography>
            <Button
              data-testid={dataTestId.tasksPage.nvi.rejectButton}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ bgcolor: 'white' }}
              disabled={!canRejectCandidate || isMutating || hasSelectedRejectCandidate}
              endIcon={<ClearIcon />}
              onClick={() => setHasSelectedRejectCandidate(true)}>
              {t('tasks.nvi.reject_nvi_candidate')}
            </Button>

            <NviCandidateRejectionDialog
              open={hasSelectedRejectCandidate}
              onCancel={() => setHasSelectedRejectCandidate(false)}
              onAccept={async (reason) => {
                await statusMutation.mutateAsync({ status: 'Rejected', reason });
                setHasSelectedRejectCandidate(false);
              }}
              isLoading={statusMutation.isPending}
            />
          </>
        )}
      </Box>

      <Divider sx={{ gridArea: 'divider2' }} />

      {canCreateNote && (
        <Box sx={{ gridArea: 'comment' }}>
          <Typography variant="h3" gutterBottom>
            {t('tasks.nvi.note')}
          </Typography>
          <Typography sx={{ mb: '1rem' }}>{t('tasks.nvi.message_description')}</Typography>
          <MessageForm
            hideRequiredAsterisk
            confirmAction={async (text) => await createNoteMutation.mutateAsync({ text })}
            fieldLabel={t('tasks.nvi.note')}
            buttonTitle={t('tasks.nvi.save_note')}
          />

          {sortedNotes.length > 0 && (
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                listStyleType: 'none',
                p: 0,
                m: 0,
                gap: '0.25rem',
              }}>
              {sortedNotes.map((note) => {
                let deleteFunction: (() => Promise<void>) | undefined = undefined;
                const noteIdentifier = note.identifier;

                const isFinalizedNote = note.type === 'FinalizedNote';

                if (isFinalizedNote && canResetApproval && note.institutionId === user?.topOrgCristinId) {
                  deleteFunction = () => statusMutation.mutateAsync({ status: 'Pending' });
                } else if (note.type === 'GeneralNote' && noteIdentifier && note.username === user?.nvaUsername) {
                  deleteFunction = () => deleteNoteMutation.mutateAsync(noteIdentifier);
                }

                const isDeleting =
                  (statusMutation.isPending && statusMutation.variables?.status === 'Pending') ||
                  (deleteNoteMutation.isPending && deleteNoteMutation.variables === noteIdentifier);

                return (
                  <ErrorBoundary key={noteIdentifier ?? note.date}>
                    <MessageItem
                      text={note.content}
                      date={note.date}
                      username={note.username}
                      backgroundColor="nvi.main"
                      showOrganization
                      menuElement={
                        !!deleteFunction && (
                          <NviNoteMenu
                            onDelete={deleteFunction}
                            isDeleting={isDeleting}
                            deleteDialogTitle={
                              isFinalizedNote ? t('tasks.nvi.reset_approval') : t('tasks.nvi.delete_note')
                            }
                            deleteDialogDescription={
                              isFinalizedNote
                                ? t('tasks.nvi.reset_approval_description')
                                : t('tasks.nvi.delete_note_description')
                            }
                          />
                        )
                      }
                    />
                  </ErrorBoundary>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
