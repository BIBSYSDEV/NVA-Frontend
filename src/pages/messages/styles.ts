import { Box, BoxProps, styled } from '@mui/material';
import { mainTheme } from '../../themes/mainTheme';

export const TaskFilter = styled(Box)<BoxProps>({
  backgroundColor: mainTheme.palette.taskType.publishingRequest.main,
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
  padding: '0rem 0.4rem',
  borderRadius: '0.25rem',
});
