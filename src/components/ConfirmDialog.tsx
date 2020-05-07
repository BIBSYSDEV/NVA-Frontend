import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from './ButtonWithProgress';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  onAccept: () => void;
  onCancel: () => void;
  disableAccept?: boolean;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, title, text, onAccept, onCancel, disableAccept = false }) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" variant="contained" onClick={onCancel}>
          {t('common:no')}
        </Button>
        <ButtonWithProgress data-testid="accept-button" isLoading={disableAccept} onClick={onAccept}>
          {t('common:yes')}
        </ButtonWithProgress>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
