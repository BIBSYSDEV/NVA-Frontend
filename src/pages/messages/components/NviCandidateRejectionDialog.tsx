import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

interface NviCandidateRejectionDialogProps {
  open: boolean;
  onCancel: () => void;
  onAccept: (reason: string) => Promise<unknown>;
  isLoading: boolean;
}

const maxReasonLength = 160;
const minReasonLength = 10;

export const NviCandidateRejectionDialog = ({
  open,
  onCancel,
  onAccept,
  isLoading,
}: NviCandidateRejectionDialogProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const handleClose = () => {
    onCancel();
    setReason('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('tasks.nvi.reject_nvi_candidate')}</DialogTitle>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await onAccept(reason.trim());
          setReason('');
        }}>
        <DialogContent>
          <Typography gutterBottom>{t('tasks.nvi.reject_nvi_candidate_modal_text')}</Typography>
          <TextField
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            data-testid={dataTestId.tasksPage.nvi.rejectionModalTextField}
            variant="filled"
            multiline
            minRows={3}
            fullWidth
            required
            label={t('tasks.nvi.reject_nvi_candidate_form_label')}
            helperText={`${reason.length}/${maxReasonLength}`}
            slotProps={{
              htmlInput: { minLength: minReasonLength, maxLength: maxReasonLength },
              formHelperText: { sx: { textAlign: 'end' } },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button data-testid={dataTestId.tasksPage.nvi.rejectionModalCancelButton} onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            data-testid={dataTestId.tasksPage.nvi.rejectionModalRejectButton}
            loading={isLoading}
            variant="contained"
            type="submit">
            {t('common.reject')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
