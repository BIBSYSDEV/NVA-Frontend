import { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  children: ReactNode;
  open: boolean;
  title: string;
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  dataTestId?: string;
}

export const ConfirmDialog = ({
  children,
  open,
  title,
  onAccept,
  onCancel,
  isLoading = false,
  dataTestId,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onCancel} data-testid={dataTestId}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" variant="outlined" onClick={onCancel}>
          {t('common.no')}
        </Button>
        <LoadingButton data-testid="accept-button" variant="contained" loading={isLoading} onClick={onAccept}>
          {t('common.yes')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
