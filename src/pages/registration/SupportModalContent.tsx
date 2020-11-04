import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, DialogActions, Typography } from '@material-ui/core';
import ButtonWithProgress from '../../components/ButtonWithProgress';

interface SupportModalContentProps {
  closeModal: () => void;
}

export const SupportModalContent: FC<SupportModalContentProps> = ({ closeModal }) => {
  const { t } = useTranslation('registration');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    // eslint-disable-next-line no-console
    console.log('message:', message);
  };

  return (
    <>
      <Typography>{t('support_description')}</Typography>
      <TextField
        variant="outlined"
        multiline
        rows="4"
        fullWidth
        label={t('common:message')}
        onChange={(event) => setMessage(event.target.value)}
      />

      <DialogActions>
        <Button variant="outlined" onClick={closeModal}>
          {t('common:cancel')}
        </Button>
        <ButtonWithProgress
          variant="contained"
          color="primary"
          data-testid="button-send-message"
          onClick={sendMessage}
          isLoading={false}>
          {t('common:send')}
        </ButtonWithProgress>
      </DialogActions>
    </>
  );
};
