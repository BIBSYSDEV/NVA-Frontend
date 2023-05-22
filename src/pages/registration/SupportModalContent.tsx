import { useTranslation } from 'react-i18next';
import { fetchRegistrationTickets } from '../../api/registrationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../redux/store';
import { userCanEditRegistration } from '../../utils/registration-helpers';
import { Box } from '@mui/material';
import { ActionPanelContent } from '../public_registration/ActionPanelContent';
import { Registration } from '../../types/registration.types';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

export const SupportModalContent = ({ registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((store: RootState) => store);

  const isRegistrationAdmin = !!registration && userCanEditRegistration(user, registration);

  const ticketsQuery = useQuery({
    enabled: isRegistrationAdmin && !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: () => fetchRegistrationTickets(registration.id),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  return (
    <Box sx={{ minWidth: { sm: '25rem', md: '35rem' } }}>
      <ActionPanelContent
        tickets={ticketsQuery.data?.tickets ?? []}
        refetchData={() => ticketsQuery.refetch()}
        registration={registration}
      />
    </Box>
  );
};
