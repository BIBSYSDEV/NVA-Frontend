import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Divider, Grid, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createTicket, fetchRegistrationTickets } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

export const SupportModalContent = ({ closeModal, registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: () => fetchRegistrationTickets(registration.id),
    meta: { errorMessage: t('feedback.error.get_tickets') },
  });

  const createSupportTicketMutation = useMutation({
    mutationFn: async (message: string) => createTicket(registration.id, 'GeneralSupportCase', message),
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.send_message'),
          variant: 'success',
        })
      );
      closeModal();
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.send_message'),
          variant: 'error',
        })
      ),
  });

  const isLoading = ticketsQuery.isPending || createSupportTicketMutation.isPending;

  const currentSupportTicket = ticketsQuery.data?.tickets
    .filter((ticket) => ticket.type === 'GeneralSupportCase')
    .at(-1);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          <Typography variant={'h3'} marginBottom={2} gutterBottom>
            {t('registration.support.self_help.header')}
          </Typography>
          <MuiLink
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              mb: '1rem',
              bgcolor: 'white',
              padding: '0.5rem',
              width: '100%',
              borderRadius: '0.5rem',
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
            <Typography>{t('footer.help_page')}</Typography>
            <OpenInNewIcon />
          </MuiLink>
          <Typography fontStyle={'italic'} marginBottom={2} gutterBottom>
            {t('registration.support.self_help.description')}
          </Typography>
        </Grid>
      </Grid>
      <Divider orientation={'horizontal'} sx={{ marginBottom: '2rem' }}>
        <Typography sx={{ textTransform: 'uppercase' }}>{t('common.or')}</Typography>
      </Divider>
      {isLoading ? (
        <Skeleton variant="text" sx={{ fontSize: '10rem' }} />
      ) : currentSupportTicket ? (
        <Typography>{t('registration.support.curator_help.already_in_progress')}</Typography>
      ) : (
        <>
          <Typography variant={'h3'} marginBottom={2} gutterBottom>
            {t('registration.support.curator_help.header')}
          </Typography>
          <Trans
            t={t}
            i18nKey="registration.support.curator_help.description"
            components={[<Typography paragraph key="1" />]}
          />
          <MessageForm
            confirmAction={async (message) => {
              if (message) {
                createSupportTicketMutation.mutate(message);
              }
            }}
          />
        </>
      )}
    </>
  );
};
