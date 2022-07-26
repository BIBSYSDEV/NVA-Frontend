import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MessageForm } from '../../components/MessageForm';
import { addMessage } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { MessageType } from '../../types/publication_types/messages.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent = ({ closeModal }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { identifier } = useParams<{ identifier: string }>();

  const sendMessage = async (message: string) => {
    const messageResponse = await addMessage(identifier, message, MessageType.Support);
    if (isErrorStatus(messageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(messageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      closeModal();
    }
  };

  return (
    <>
      <Typography paragraph>
        <Trans i18nKey="registration.support_description">
          <Link component={RouterLink} to="/my-messages" />
        </Trans>
      </Typography>

      <MessageForm confirmAction={sendMessage} cancelAction={closeModal} />
    </>
  );
};
