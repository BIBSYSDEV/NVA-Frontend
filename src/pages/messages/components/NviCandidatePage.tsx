import { Box, Paper, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { CreateNoteData, createNote } from '../../../api/scientificIndexApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { MessageForm } from '../../../components/MessageForm';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { setNotification } from '../../../redux/notificationSlice';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';
import { MessageItem } from './MessageList';

export const NviCandidatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier } = useParams<IdentifierParams>();

  const nviCandidateQuery = useQuery({
    enabled: !!identifier,
    queryKey: ['nviCandidate', identifier],
    queryFn: () => fetchNviCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_nvi_candidate') },
  });
  const registrationIdentifier = getIdentifierFromId(nviCandidateQuery.data?.publicationId ?? '');

  const registrationQuery = useQuery({
    enabled: !!registrationIdentifier,
    queryKey: ['registration', registrationIdentifier],
    queryFn: () => fetchRegistration(registrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const noteMutation = useMutation({
    mutationFn: async (note: CreateNoteData) => {
      await createNote(identifier, note);
      await nviCandidateQuery.refetch();
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.create_note'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.create_note'), variant: 'error' })),
  });

  const sortedNotes = (nviCandidateQuery.data?.notes ?? []).sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);
    return dateB.getTime() - dateA.getTime();
  });

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
        <>
          <ErrorBoundary>
            <PublicRegistrationContent registration={registrationQuery.data} />
          </ErrorBoundary>

          <Paper elevation={0} sx={{ gridArea: 'nvi', bgcolor: 'nvi.light' }}>
            <StyledPaperHeader>
              <Typography color="inherit" variant="h1">
                {t('common.dialogue')}
              </Typography>
            </StyledPaperHeader>

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
                  {sortedNotes.map((note) => (
                    <ErrorBoundary key={note.createdDate}>
                      <MessageItem
                        text={note.text}
                        date={note.createdDate}
                        senderId={note.user}
                        backgroundColor="nvi.main"
                      />
                    </ErrorBoundary>
                  ))}
                </Box>
              )}

              <MessageForm
                confirmAction={async (text) => {
                  await noteMutation.mutateAsync({ text });
                }}
                fieldLabel={t('tasks.nvi.note')}
                buttonTitle={t('tasks.nvi.save_note')}
              />
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};
