import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchRegistration, fetchRegistrationTickets } from '../../api/registrationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationParams } from '../../utils/urlPaths';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../redux/store';
import { userCanEditRegistration } from '../../utils/registration-helpers';
import { ActionPanel } from '../public_registration/ActionPanel';
import { Typography } from '@mui/material';

interface SupportModalContentProps {
  closeModal: () => void;
  registrationId: string;
}

export const SupportModalContent = ({ closeModal, registrationId }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((store: RootState) => store);
  const { identifier } = useParams<RegistrationParams>();

  const registrationQuery = useQuery({
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(identifier),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_registration'), variant: 'error' })),
  });

  const registration = registrationQuery.data;
  const isRegistrationAdmin = !!registration && userCanEditRegistration(user, registration);

  const ticketsQuery = useQuery({
    enabled: isRegistrationAdmin && !!registrationId,
    queryKey: ['registrationTickets', registrationId],
    queryFn: () => fetchRegistrationTickets(registrationId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_tickets'), variant: 'error' })),
  });

  return registration ? (
    <ActionPanel
      tickets={ticketsQuery.data?.tickets ?? []}
      refetchRegistrationAndTickets={() => ticketsQuery.refetch()}
      isLoadingData={false}
      registration={registration}
    />
  ) : (
    <Typography>{t('common.error_occurred')}</Typography>
  );
};
