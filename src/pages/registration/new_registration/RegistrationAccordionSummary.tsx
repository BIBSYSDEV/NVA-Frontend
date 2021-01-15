import React, { ReactNode } from 'react';
import { AccordionSummary, AccordionSummaryProps, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

const StyledAccordionSummary = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    align-items: center;
    padding: 1rem 0;
  }
`;

const StyledIcon = styled.div`
  margin-right: 1rem;
  .MuiSvgIcon-root {
    font-size: 4rem;
    @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
      display: none;
    }
  }
`;

interface RegistrationAccordionSummaryProps extends AccordionSummaryProps {
  title: string;
  description: string;
  ariaControls: string;
  dataTestId: string;
  icon: ReactNode;
}

export const RegistrationAccordionSummary = ({
  title,
  description,
  icon,
  ariaControls,
  dataTestId,
  ...props
}: RegistrationAccordionSummaryProps) => (
  <StyledAccordionSummary
    expandIcon={<ExpandMoreIcon fontSize="large" />}
    aria-controls={ariaControls}
    data-testid={dataTestId}
    {...props}>
    <StyledIcon>{icon}</StyledIcon>
    <div>
      <Typography variant="h2">{title}</Typography>
      <Typography>{description}</Typography>
    </div>
  </StyledAccordionSummary>
);
