import { Trans, useTranslation } from 'react-i18next';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MessageForm } from '../../components/MessageForm';
import { addTicketMessage, createTicket } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface SupportModalContentProps {
  closeModal: () => void;
  registrationId: string;
}

export const SupportModalContent = ({ closeModal, registrationId }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const sendMessage = async (message: string) => {
    // Create ticket
    const createTicketResponse = await createTicket(registrationId, 'GeneralSupportCase');
    if (isErrorStatus(createTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(createTicketResponse.status)) {
      const ticketId = createTicketResponse.data.id;
      // Add message
      const addMessageResponse = await addTicketMessage(ticketId, message);
      if (isErrorStatus(addMessageResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
      } else if (isSuccessStatus(addMessageResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
        closeModal();
      }
    }
  };

  return (
    <>
      <Typography paragraph>
        <Trans i18nKey="registration.support_description">
          <Link component={RouterLink} to={UrlPathTemplate.MyPageMessages} />
        </Trans>
      </Typography>

      <MessageForm confirmAction={sendMessage} cancelAction={closeModal} />
    </>
  );
};
