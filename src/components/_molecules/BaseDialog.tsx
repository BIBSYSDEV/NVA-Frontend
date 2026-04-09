import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';
import { CloseDialogRightCornerButton } from '../buttons/CloseDialogRightCornerButton';

interface BaseDialogProps {
  isOpen: boolean;
  dataTestId: string;
  dialogTitle?: string;
  onClose?: () => void;
  children?: ReactNode;
  boxMaxWidth?: number;
  dialogActions?: ReactNode;
}

export const BaseDialog = ({
  isOpen,
  dialogTitle,
  onClose,
  children,
  boxMaxWidth = 450,
  dataTestId,
  dialogActions,
}: BaseDialogProps) => {
  return (
    <Dialog
      open={isOpen}
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
      {children && <DialogContent>{children}</DialogContent>}
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};
