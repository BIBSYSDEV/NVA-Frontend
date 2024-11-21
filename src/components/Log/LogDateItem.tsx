import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Box, Typography } from '@mui/material';

interface LogDateItemProps {
  date: Date | string | number;
}

export const LogDateItem = ({ date }: LogDateItemProps) => {
  const dateObject = date instanceof Date ? date : new Date(date);

  const dateString = dateObject.toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeString = dateObject.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <DateRangeIcon color="primary" fontSize="small" />
      <Typography>{dateString},</Typography>
      <AccessTimeIcon color="primary" fontSize="small" />
      <Typography>{timeString}</Typography>
    </Box>
  );
};
