import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { MessageForm } from '../../components/MessageForm';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent: FC<SupportModalContentProps> = ({ closeModal }) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Typography>{t('support_description')}</Typography>
      <MessageForm
        confirmAction={(message) => {
          console.log('message', message);
          closeModal();
        }}
      />
    </>
  );
};
