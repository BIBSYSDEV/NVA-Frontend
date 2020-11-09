import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { MessageForm } from '../../components/MessageForm';
import { setNotification } from '../../redux/actions/notificationActions';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent: FC<SupportModalContentProps> = ({ closeModal }) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();

  return (
    <>
      <Typography>{t('support_description')}</Typography>
      <MessageForm
        confirmAction={(message) => {
          // TODO: Send message to backend
          // eslint-disable-next-line no-console
          console.log('Support Message:', message);
          closeModal();
          dispatch(setNotification(t('feedback:success.support_message_sent')));
        }}
        cancelAction={closeModal}
      />
    </>
  );
};
