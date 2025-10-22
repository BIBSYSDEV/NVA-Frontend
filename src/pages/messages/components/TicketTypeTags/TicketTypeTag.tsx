import { Box, BoxProps, styled } from '@mui/material';

export const TaskFilter = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.taskType.publishingRequest.main,
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
  padding: '0rem 0.4rem',
  borderRadius: '0.25rem',
}));

export interface Count {
  count: number;
}

interface TicketTypeTagProps {
  text: string;
  icon: React.ReactNode;
  count?: Count;
  color?: string;
}

export const TicketTypeTag = ({ count, icon, text, color }: TicketTypeTagProps) => {
  return (
    <TaskFilter sx={{ bgcolor: color }}>
      {icon}
      {count?.count ? `${text} (${count.count})` : text}
    </TaskFilter>
  );
};
