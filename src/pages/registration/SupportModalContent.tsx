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

export const SupportModalContent = ({ closeModal, registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: async () => await fetchRegistrationTickets(registration.id),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  const addMessageMutation = useMutation(async (data: any) => await addTicketMessage(data.ticketId, data.message), {
    onError: () => dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' })),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      closeModal();
    },
  });

  const createSupportTicketMutation = useMutation(
    async (message: string) => await createTicket(registration.id, 'GeneralSupportCase', true),
    {
      onSuccess: (data, message) => addMessageMutation.mutate({ ticketId: data.data?.id, message: message }),
      onError: () => dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' })),
    }
  );
  const isLoading = ticketsQuery.isLoading || addMessageMutation.isLoading || createSupportTicketMutation.isLoading;

  let tickets = ticketsQuery.data?.tickets ?? [];
  tickets = tickets.filter((ticket) => ticket.type === 'GeneralSupportCase');
  const currentSupportTicket = tickets.length > 0 ? tickets.at(tickets.length - 1) : null;

  const renderActiveTicketPresent = () => {
    return <Typography>{t('registration.support.curator_help.already_in_progress')}</Typography>;
  };

  const renderLoadingTickets = () => {
    return <Skeleton variant="text" sx={{ fontSize: '10rem' }} />;
  };

  const renderCreateTicket = () => {
    return (
      <>
        <Typography variant={'h3'} marginBottom={2} gutterBottom>
          {t('registration.support.curator_help.header')}
        </Typography>
        <Trans t={t} i18nKey="registration.support.curator_help.description" components={[<Typography paragraph />]} />
        <MessageForm
          confirmAction={async (message) => {
            if (message) {
              createSupportTicketMutation.mutate(message);
            }
          }}
        />
      </>
    );
  };

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12}>
            <Typography variant={'h3'} marginBottom={2} gutterBottom>
              {t('registration.support.self_help.header')}
            </Typography>
            <MuiLink
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                display: 'flex',
                gap: '0.5rem',
                mb: '1rem',
              }}
              target="_blank"
              rel="noopener noreferrer"
              href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
              <Box bgcolor={'white'} padding={1} marginBottom={2} width={'100%'} sx={{ borderRadius: 2 }}>
                <Grid container>
                  <Grid item xs={11}>
                    <Typography variant={'body1'}>{t('footer.help_page')}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <OpenInNew fontSize="small" />
                  </Grid>
                </Grid>
              </Box>
            </MuiLink>
            <Typography fontStyle={'italic'} marginBottom={2} gutterBottom>
              {t('registration.support.self_help.description')}
            </Typography>
          </Grid>
          <Grid item md={6} sm={12}></Grid>
        </Grid>
      </Box>
      <Divider orientation={'horizontal'} sx={{ marginBottom: '2rem' }}>
        <Typography color={'blue'} sx={{ textTransform: 'uppercase' }}>
          {t('common.or')}
        </Typography>
      </Divider>
      <Box>
        {isLoading ? renderLoadingTickets() : currentSupportTicket ? renderActiveTicketPresent() : renderCreateTicket()}
      </Box>
    </>
  );
};
