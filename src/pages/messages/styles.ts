import { Box, BoxProps, styled } from '@mui/material';

export const TaskFilter = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.taskType.publishingRequest.main,
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
  padding: '0rem 0.4rem',
  borderRadius: '0.25rem',
}));
