import { useTranslation } from 'react-i18next';
import { fetchRegistrationTickets } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { useQuery } from '@tanstack/react-query';
import { ActionPanelContent } from '../public_registration/ActionPanelContent';
import { Registration } from '../../types/registration.types';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

export const SupportModalContent = ({ registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.id],
    queryFn: () => fetchRegistrationTickets(registration.id),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  return (
    <ActionPanelContent
      canCreateTickets={false}
      tickets={ticketsQuery.data?.tickets ?? []}
      refetchData={() => ticketsQuery.refetch()}
      registration={registration}
    />
  );
};
