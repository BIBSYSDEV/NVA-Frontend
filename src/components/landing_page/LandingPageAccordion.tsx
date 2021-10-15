import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from '@mui/material';
import { ReactNode } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ErrorBoundary } from '../ErrorBoundary';

const StyledLandingPageAccordion = styled(Accordion)`
  background: ${({ theme }) => theme.palette.background.default};
  border-top: 1px solid;
  :last-child {
    border-bottom: 1px solid;
  }

  &.MuiAccordion-root.Mui-expanded {
    margin: 0;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  padding: 1rem 1rem 1rem 0;

  .MuiAccordionSummary-content {
    margin: 0;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: block;
  padding: 0;
  margin-bottom: 2rem;
`;

interface LandingPageAccordionProps extends Pick<AccordionProps, 'defaultExpanded'> {
  heading: string;
  children?: ReactNode;
}

export const LandingPageAccordion = ({ heading, children, ...props }: LandingPageAccordionProps) => (
  <StyledLandingPageAccordion square elevation={0} {...props}>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
      <Typography variant="h3" component="h2" color="primary">
        {heading}
      </Typography>
    </StyledAccordionSummary>
    <ErrorBoundary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </ErrorBoundary>
  </StyledLandingPageAccordion>
);
