import { Box, Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { useId } from 'react';
import { useDelayedOpen } from './hooks/useDelayedOpen';

const defaultOpenDelayMs = 400;
const defaultMinVisibleMs = 500;

interface ProgressDialogProps {
  open: boolean;
  title: string;
  label: string;
  value?: number;
  openDelayMs?: number;
  minVisibleMs?: number;
}

export const ProgressDialog = ({
  open,
  title,
  label,
  value,
  openDelayMs = defaultOpenDelayMs,
  minVisibleMs = defaultMinVisibleMs,
}: ProgressDialogProps) => {
  const titleId = useId();
  const progressLabelId = useId();
  const effectiveOpen = useDelayedOpen(open, openDelayMs, minVisibleMs);

  const isDeterminate = value !== undefined;
  const percentage = isDeterminate ? Math.max(0, Math.min(100, Math.round(value))) : 0;

  return (
    <Dialog open={effectiveOpen} fullWidth maxWidth="xs" aria-labelledby={titleId}>
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LinearProgress
            aria-labelledby={progressLabelId}
            variant={isDeterminate ? 'determinate' : 'indeterminate'}
            value={percentage}
            color="secondary"
            sx={{
              flexGrow: 1,
              height: '1rem',
              bgcolor: 'tertiary.main',
              borderRadius: '0.5rem',
            }}
          />
          {isDeterminate && <Typography aria-hidden="true">{percentage}%</Typography>}
        </Box>
        <Typography id={progressLabelId} role="status" aria-live="polite" sx={{ mt: '0.5rem' }}>
          {label}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
