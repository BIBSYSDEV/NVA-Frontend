import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Box, Typography } from '@mui/material';
import { toDateString } from '../../../utils/date-helpers';

interface LogDateItemProps {
  date: string;
}

export const LogDateItem = ({ date }: LogDateItemProps) => {
  const dateObj = new Date(date);
  const dateString = toDateString(dateObj);
  const timeString = dateObj.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <DateRangeIcon color="primary" fontSize="small" />
      <Typography>{dateString}</Typography>
      <AccessTimeIcon color="primary" fontSize="small" />
      <Typography>{timeString}</Typography>
    </Box>
  );
};
