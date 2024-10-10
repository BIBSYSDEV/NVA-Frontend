import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';

interface ConfirmMessageDialogProps {
  children?: ReactNode;
  open: boolean;
  title: string;
  onAccept: (message: string) => Promise<unknown>;
  onCancel: () => void;
  textFieldLabel: string;
  confirmButtonLabel?: string;
}

export const ConfirmMessageDialog = ({
  children,
  open,
  onCancel,
  onAccept,
  title,
  textFieldLabel,
  confirmButtonLabel,
}: ConfirmMessageDialogProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <form
        onSubmit={async (event) => {
          setIsSubmitting(true);
          event.preventDefault();
          try {
            const value: string = event.currentTarget.note.value;
            await onAccept(value);
          } finally {
            setIsSubmitting(false);
          }
        }}>
        <DialogContent>
          {children}

          <TextField
            required
            fullWidth
            disabled={isSubmitting}
            minRows={3}
            multiline
            variant="filled"
            name="note"
            label={textFieldLabel}
          />
        </DialogContent>
        <DialogActions>
          <Button data-testid={dataTestId.confirmDialog.cancelButton} onClick={onCancel} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            type="submit"
            data-testid={dataTestId.confirmDialog.acceptButton}
            variant="contained"
            loading={isSubmitting}>
            {confirmButtonLabel ?? t('common.save')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
