import { ReactNode, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';

interface ConfirmDialogProps {
  children: ReactNode;
  open: boolean;
  title: string;
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  dialogDataTestId?: string;
  ignoreBackdropClick?: boolean;
}

export const ConfirmDialog = ({
  children,
  open,
  title,
  onAccept,
  onCancel,
  isLoading = false,
  ignoreBackdropClick = false,
  dialogDataTestId,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onAccept();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  return (
    <Dialog open={open} onClose={!ignoreBackdropClick ? onCancel : undefined} data-testid={dialogDataTestId}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button data-testid={dataTestId.confirmDialog.cancelButton} variant="outlined" onClick={onCancel}>
          {t('common.no')}
        </Button>
        <LoadingButton
          data-testid={dataTestId.confirmDialog.acceptButton}
          variant="contained"
          loading={isLoading}
          onClick={onAccept}>
          {t('common.yes')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
