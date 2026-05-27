import { Box, Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface BibtexExportProgressDialogProps {
  open: boolean;
  fetchedCount: number;
  totalCount: number;
}

export const BibtexExportProgressDialog = ({ open, fetchedCount, totalCount }: BibtexExportProgressDialogProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const progressLabelId = useId();

  const cappedFetched = Math.min(fetchedCount, totalCount);
  const isDeterminate = totalCount > 0;
  const percentage = isDeterminate ? Math.round((cappedFetched / totalCount) * 100) : 0;

  return (
    <Dialog open={open} fullWidth maxWidth="xs" aria-labelledby={titleId}>
      <DialogTitle id={titleId}>{t('search.exporting_bibtex')}</DialogTitle>
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
          {isDeterminate
            ? t('search.export_progress_count', { fetched: cappedFetched, total: totalCount })
            : t('search.exporting_bibtex')}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
