import { useMutation, useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addTicketMessage, createTicket, fetchRegistrationTickets } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';
import { Box, Divider, Grid, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { MessageForm } from '../../components/MessageForm';
import { OpenInNew } from '@mui/icons-material';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

interface AddTicketMessageData {
  ticketId: string;
  message: string;
}

export const SupportModalContent = ({ closeModal, registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: () => fetchRegistrationTickets(registration.id),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  const addMessageMutation = useMutation(
    async (data: AddTicketMessageData) => await addTicketMessage(data.ticketId, data.message),
    {
      onError: () => dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' })),
      onSuccess: () => {
        dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
        closeModal();
      },
    }
  );

  const createSupportTicketMutation = useMutation(
    async (message: string) => await createTicket(registration.id, 'GeneralSupportCase', true),
    {
      onSuccess: (data, message) => addMessageMutation.mutate({ ticketId: data.data?.id || '', message: message }),
      onError: () => dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' })),
    }
  );
  const isLoading = ticketsQuery.isLoading || addMessageMutation.isLoading || createSupportTicketMutation.isLoading;

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
            <OpenInNew />
          </MuiLink>
          <Typography fontStyle={'italic'} marginBottom={2} gutterBottom>
            {t('registration.support.self_help.description')}
          </Typography>
        </Grid>
        <Grid item md={6} sm={12}></Grid>
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
            components={[<Typography paragraph />]}
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
