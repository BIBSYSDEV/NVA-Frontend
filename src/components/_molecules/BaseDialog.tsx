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
  isLoading?: boolean;
}

export const BaseDialog = ({
  open,
  dialogTitle,
  onClose,
  children,
  boxMaxWidth = 450,
  dataTestId,
  dialogActions,
  isLoading,
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
            <CloseTextAndIconButton
              data-testid={`${dataTestId}-close-button`}
              onClick={onClose}
              sx={{ position: 'absolute', top: 14, right: 8 }}
            />
          )}
        </DialogTitle>
      )}
      {(children || isLoading) && <DialogContent>{!isLoading ? children : <PageSpinner />}</DialogContent>}
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};
