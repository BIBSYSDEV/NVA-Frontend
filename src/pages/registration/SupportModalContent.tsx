import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Divider, Grid, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket, fetchRegistrationTickets } from '../../api/registrationApi';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';
import { RootState } from '../../redux/store';
import { styled } from '@mui/system';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

const StyledMuiLink = styled(MuiLink)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.5rem',
  marginBottom: '1rem',
  backgroundColor: 'white',
  padding: '0.5rem',
  width: '100%',
  borderRadius: '0.5rem',
});

export const SupportModalContent = ({ closeModal, registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const customerServiceCenterUri = customer?.serviceCenter?.uri;

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: () => fetchRegistrationTickets(registration.id),
    meta: { errorMessage: t('feedback.error.get_tickets') },
  });

  const createSupportTicketMutation = useMutation({
    mutationFn: (message: string) => createTicket(registration.id, 'GeneralSupportCase', message),
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
          <Typography variant="h3" marginBottom={2} gutterBottom>
            {t('registration.support.self_help.header')}
          </Typography>
          <StyledMuiLink
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
            <Typography>{t('footer.help_page')}</Typography>
            <OpenInNewIcon />
          </StyledMuiLink>
          <Typography fontStyle="italic" marginBottom={2} gutterBottom>
            {t('registration.support.self_help.description')}
          </Typography>
        </Grid>
        {customerServiceCenterUri && (
          <Grid item md={6} sm={12}>
            <Typography variant="h3" marginBottom={2} gutterBottom>
              {t('editor.institution.institution_support')}
            </Typography>
            <StyledMuiLink target="_blank" rel="noopener noreferrer" href={customerServiceCenterUri}>
              <Typography>{customerServiceCenterUri}</Typography>
              <OpenInNewIcon />
            </StyledMuiLink>
            <Trans i18nKey="registration.support.self_help.institution_help_description">
              <Typography key="1" fontStyle="italic" />
            </Trans>
          </Grid>
        )}
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
