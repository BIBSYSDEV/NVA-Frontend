import { Accordion, styled } from '@mui/material';

export const RegistrationAccordion = styled(Accordion)(({ theme }) => ({
  background: theme.palette.secondary.light,
  '.MuiAccordionSummary-content': {
    alignItems: 'center',
    padding: '1rem 0',
    gap: '1rem',

    '.MuiSvgIcon-root': {
      fontSize: '4rem',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },

  '.MuiAccordionDetails-root': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
}));
