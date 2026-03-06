import { Box, LinearProgress, Skeleton, Typography } from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface NviReportProgressBarProps {
  completedPercentage: number;
  completedCount: number;
  totalCount: number;
  isPending: boolean;
}

export const NviReportProgressBar = ({
  completedPercentage,
  completedCount,
  totalCount,
  isPending,
}: NviReportProgressBarProps) => {
  const { t } = useTranslation();
  const progressLabelId = useId();
  return (
    <>
      <Typography fontWeight="bold">{t('tasks.nvi.progress_nvi_reporting')}</Typography>
      {isPending ? (
        <>
          <Skeleton />
          <Skeleton sx={{ maxWidth: '10rem' }} />
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <LinearProgress
              aria-labelledby={progressLabelId}
              variant="determinate"
              value={completedPercentage}
              color="secondary"
              sx={{
                flexGrow: 1,
                my: '0.175rem',
                height: '1rem',
                bgcolor: 'tertiary.main',
                borderRadius: '0.5rem',
              }}
            />
            <Typography>{completedPercentage}%</Typography>
          </Box>
          <Typography id={progressLabelId} gutterBottom>
            {t('tasks.nvi.completed_count', {
              completed: completedCount,
              total: totalCount,
            })}
          </Typography>
        </>
      )}
    </>
  );
};
