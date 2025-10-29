import { AccordionSummary, styled } from '@mui/material';

export const TaskAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  fontWeight: 700,
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.background.neutral87,
  borderLeft: '0.5rem solid',
}));
