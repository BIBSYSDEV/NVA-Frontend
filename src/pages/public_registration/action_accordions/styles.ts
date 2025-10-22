import { AccordionSummary, styled } from '@mui/material';

export const TaskAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  fontWeight: 700,
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.grey['400'],
  borderLeft: '0.5rem solid',
}));
