import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';
import { PageSpinner } from '../PageSpinner';
import { CloseDialogRightCornerButton } from './buttons/CloseDialogRightCornerButton';

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
          {onClose && (
            <CloseDialogRightCornerButton onClick={onClose} sx={{ position: 'absolute', top: 14, right: 8 }} />
          )}
        </DialogTitle>
      )}
      {children && <DialogContent>{!isFetchingData ? children : <PageSpinner />}</DialogContent>}
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};
