import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';
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
      bgcolor: 'white',
      borderTop: '1px solid',
      ':last-child': {
        borderBottom: '1px solid',
      },
      '&.MuiAccordion-root.Mui-expanded': {
        margin: 0,
      },
    }}
    data-testid={dataTestId}
    {...props}>
    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{ padding: '0' }} id={dataTestId}>
      {typeof heading === 'string' ? (
        <Typography variant="h2" color="primary">
          {heading}
        </Typography>
      ) : (
        heading
      )}
    </AccordionSummary>
    <AccordionDetails sx={{ padding: 0, marginBottom: '2rem' }}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AccordionDetails>
  </Accordion>
);
