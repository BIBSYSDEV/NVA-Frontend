import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MessageForm } from '../../components/MessageForm';
import { addMessage } from '../../api/registrationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { MessageType } from '../../types/publication_types/messages.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent = ({ closeModal }: SupportModalContentProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const { identifier } = useParams<{ identifier: string }>();

  const sendMessage = async (message: string) => {
    const messageResponse = await addMessage(identifier, message, MessageType.Support);
    if (isErrorStatus(messageResponse.status)) {
      dispatch(setNotification(t('error.send_message')));
    } else if (isSuccessStatus(messageResponse.status)) {
      dispatch(setNotification(t('success.send_message')));
      closeModal();
    }
  };

  return (
    <>
      <Typography>
        <Trans i18nKey="registration:support_description">
          <Link component={RouterLink} to="/my-messages" />
        </Trans>
      </Typography>

      <MessageForm confirmAction={sendMessage} cancelAction={closeModal} />
    </>
  );
};
