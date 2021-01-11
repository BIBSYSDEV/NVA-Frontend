import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import { Link, Typography } from '@material-ui/core';
import { MessageForm } from '../../components/MessageForm';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent: FC<SupportModalContentProps> = ({ closeModal }) => {
  return (
    <>
      <Typography>
        <Trans i18nKey="registration:support_description">
          <Link href="/my-messages" />
        </Trans>
      </Typography>

      <MessageForm
        confirmAction={(message) => {
          // TODO: Send message to backend
          // eslint-disable-next-line no-console
          console.log('Support Message:', message);
          closeModal();
          // dispatch(setNotification(t('feedback:success.message_sent')));
        }}
        cancelAction={closeModal}
      />
    </>
  );
};
