import { Accordion } from '@mui/material';
import { styled } from '@mui/system';

export const RegistrationAccordion = styled(Accordion)(({ theme }) => ({
  background: theme.palette.secondary.main,
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
