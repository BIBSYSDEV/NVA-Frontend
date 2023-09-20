import SendIcon from '@mui/icons-material/Send';
import { Box, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { CreateNoteData, createNote } from '../../../api/scientificIndexApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';
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
              {nviCandidateQuery.data && nviCandidateQuery.data.notes.length > 0 && (
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
                  {nviCandidateQuery.data.notes.map((note) => (
                    <ErrorBoundary key={note.createdDate}>
                      <MessageItem
                        text={note.text}
                        date={note.createdDate}
                        senderId={note.user.value}
                        backgroundColor="nvi.main"
                      />
                    </ErrorBoundary>
                  ))}
                </Box>
              )}

              <Formik
                initialValues={{ text: '' }}
                onSubmit={async (values, { resetForm }) => {
                  await noteMutation.mutateAsync(values);
                  resetForm();
                }}>
                {({ isSubmitting }) => (
                  <Form>
                    <Field name="text">
                      {({ field }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          variant="filled"
                          label={t('tasks.nvi.note')}
                          data-testid={dataTestId.tasksPage.nvi.dialoguePanel.noteField}
                          fullWidth
                          multiline
                          required
                          disabled={isSubmitting}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {isSubmitting ? (
                                  <CircularProgress aria-label={t('tasks.nvi.save_note')} size="1.5rem" />
                                ) : (
                                  <IconButton
                                    type="submit"
                                    color="primary"
                                    title={t('tasks.nvi.save_note')}
                                    data-testid={dataTestId.tasksPage.nvi.dialoguePanel.sendNoteButton}>
                                    <SendIcon />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                  </Form>
                )}
              </Formik>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};
