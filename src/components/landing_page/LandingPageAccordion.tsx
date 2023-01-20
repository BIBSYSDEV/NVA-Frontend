import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ErrorBoundary } from '../ErrorBoundary';

interface LandingPageAccordionProps extends Pick<AccordionProps, 'defaultExpanded'> {
  dataTestId: string;
  heading: ReactNode;
  children?: ReactNode;
}

export const LandingPageAccordion = ({ heading, children, dataTestId, ...props }: LandingPageAccordionProps) => (
  <Accordion
    square
    elevation={0}
    sx={{
      borderTop: '1px solid',
      ':last-child': {
        borderBottom: '1px solid',
      },
      '&.MuiAccordion-root.Mui-expanded': {
        margin: 0,
      },
      bgcolor: 'secondary.light',
    }}
    data-testid={dataTestId}
    {...props}>
    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{ padding: '0' }} id={dataTestId}>
      <Typography variant="h3" component="h2" color="primary">
        {heading}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ padding: 0, marginBottom: '2rem' }}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AccordionDetails>
  </Accordion>
);
