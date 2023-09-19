import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRegistration } from '../../../api/registrationApi';
import { createNote } from '../../../api/scientificIndexApi';
import { fetchNviCandidate } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { StyledPaperHeader } from '../../../components/PageWithSideMenu';
import { setNotification } from '../../../redux/notificationSlice';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { PublicRegistrationContent } from '../../public_registration/PublicRegistrationContent';

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
    mutationFn: async (text: string) => {
      await createNote(identifier, { text });
      await nviCandidateQuery.refetch();
    },
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
          <ErrorBoundary>
            <Paper elevation={0} sx={{ gridArea: 'nvi' }}>
              <StyledPaperHeader>
                <Typography color="inherit" variant="h1">
                  {t('common.dialogue')}
                </Typography>
              </StyledPaperHeader>

              <Box sx={{ m: '1rem' }}>
                {nviCandidateQuery.data?.notes.map((note) => {
                  return <Typography>{note.text}</Typography>;
                })}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const textInput = (event.target as any).elements[0].value;
                    noteMutation.mutate(textInput);
                    // (event.target as any).reset();
                  }}>
                  <TextField
                    variant="filled"
                    label={t('tasks.nvi.note')}
                    fullWidth
                    multiline
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="submit" color="primary" title={t('common.send')}>
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Box>
            </Paper>
          </ErrorBoundary>
        </>
      )}
    </Box>
  );
};
