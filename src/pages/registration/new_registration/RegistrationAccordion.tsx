import React, { ReactNode, ChangeEvent } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

interface RegistrationAccordionProps {
  headerLabel: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
  ariaControls: string;
  children: ReactNode;
  dataTestId?: string;
}

const StyledRegistrationAccordion = styled(Accordion)`
  margin-bottom: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: 90vw;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  min-height: 5rem;
  align-items: center;
`;

const StyledIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const RegistrationAccordion = ({
  headerLabel,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
}: RegistrationAccordionProps) => {
  return (
    <StyledRegistrationAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} data-testid={dataTestId}>
        <StyledIcon>{icon}</StyledIcon>
        <Typography variant="h6">{headerLabel}</Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledRegistrationAccordion>
  );
};

export default RegistrationAccordion;
