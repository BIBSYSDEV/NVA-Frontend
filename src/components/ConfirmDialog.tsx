import { ReactNode } from 'react';
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

  const handleKeypress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      event.preventDefault();
      onAccept();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!ignoreBackdropClick ? onCancel : undefined}
      data-testid={dialogDataTestId}
      onKeyDown={handleKeypress}>
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
