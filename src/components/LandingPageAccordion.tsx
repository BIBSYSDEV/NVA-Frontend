import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from '@material-ui/core';
import { ReactNode } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledLandingPageAccordion = styled(Accordion)`
  background: ${({ theme }) => theme.palette.background.default};
  margin: 0 !important;
  :last-child {
    border-bottom: 3px solid;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  border-top: 3px solid;
  margin: 0 !important;
  padding: 1rem 0 1rem 0;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 0;
  margin-bottom: 1rem;
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
    <StyledAccordionDetails>{children}</StyledAccordionDetails>
  </StyledLandingPageAccordion>
);
