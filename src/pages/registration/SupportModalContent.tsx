import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchRegistrationTickets } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';
import { ActionPanelContent } from '../public_registration/ActionPanelContent';

interface SupportModalContentProps {
  closeModal: () => void;
  registration: Registration;
}

export const SupportModalContent = ({ registration }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ticketsQuery = useQuery({
    enabled: !!registration,
    queryKey: ['registrationTickets', registration.identifier],
    queryFn: () => fetchRegistrationTickets(registration.identifier),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  return (
    <ActionPanelContent
      tickets={ticketsQuery.data?.tickets ?? []}
      refetchData={() => ticketsQuery.refetch()}
      registration={registration}
    />
  );
};
