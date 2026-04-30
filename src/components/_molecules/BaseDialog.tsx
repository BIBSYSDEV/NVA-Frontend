import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';
import { CloseTextAndIconButton } from '../_atoms/buttons/CloseTextAndIconButton';
import { PageSpinner } from '../PageSpinner';

interface BaseDialogProps extends Omit<DialogProps, 'onClose'> {
  dataTestId: string;
  onClose?: () => void;
  dialogTitle?: string;
  ariaLabel?: string;
  boxMaxWidth?: string | number;
  dialogActions?: ReactNode;
  showLoader?: boolean;
}

export const BaseDialog = ({
  open,
  dialogTitle,
  ariaLabel,
  onClose,
  children,
  boxMaxWidth = '28rem',
  dataTestId,
  dialogActions,
  showLoader,
  ...rest
}: BaseDialogProps) => {
  const titleId = `${dataTestId}-title`;
  const showCloseIcon = !!onClose;

  return (
    <Dialog
      {...rest}
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby={dialogTitle ? titleId : undefined}
      aria-label={ariaLabel}
      slotProps={{ paper: { sx: { maxWidth: boxMaxWidth } } }}
      data-testid={dataTestId}>
      {(dialogTitle || showCloseIcon) && (
        <DialogTitle
          id={dialogTitle ? titleId : undefined}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowWrap: 'anywhere' }}>
          {dialogTitle}
          {showCloseIcon && <CloseTextAndIconButton data-testid={`${dataTestId}-close-button`} onClick={onClose} />}
        </DialogTitle>
      )}
      {(children || showLoader) && <DialogContent>{!showLoader ? children : <PageSpinner />}</DialogContent>}
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
};
