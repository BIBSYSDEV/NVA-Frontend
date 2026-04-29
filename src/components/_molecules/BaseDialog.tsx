import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';
import { CloseTextAndIconButton } from '../_atoms/buttons/CloseTextAndIconButton';
import { PageSpinner } from '../PageSpinner';

interface BaseDialogProps extends Omit<DialogProps, 'onClose'> {
  onClose?: () => void;
  dataTestId: string;
  dialogTitle?: string;
  boxMaxWidth?: number;
  dialogActions?: ReactNode;
  isFetchingData?: boolean;
}

export const BaseDialog = ({
  open,
  dialogTitle,
  onClose,
  children,
  boxMaxWidth = 450,
  dataTestId,
  dialogActions,
  isFetchingData,
  ...rest
}: BaseDialogProps) => {
  return (
    <Dialog
      {...rest}
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { sx: { width: '100%', maxWidth: boxMaxWidth } } }}
      data-testid={dataTestId}>
      {(dialogTitle || onClose) && (
        <DialogTitle sx={{ pr: 14, overflowWrap: 'anywhere' }}>
          {dialogTitle}
          {onClose && <CloseTextAndIconButton onClick={onClose} sx={{ position: 'absolute', top: 14, right: 8 }} />}
        </DialogTitle>
      )}
      {children && <DialogContent>{!isFetchingData ? children : <PageSpinner />}</DialogContent>}
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};
