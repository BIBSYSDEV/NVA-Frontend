import React, { ReactNode, ChangeEvent } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

interface RegistrationAccordionProps {
  summaryTitle: string;
  summaryDescription: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
  ariaControls: string;
  children: ReactNode;
  dataTestId?: string;
}

const StyledAccordion = styled(Accordion)`
  background: ${({ theme }) => theme.palette.background.default};
  border-width: 4px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
    max-width: 90vw;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    align-items: center;
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

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const RegistrationAccordion = ({
  summaryTitle,
  summaryDescription,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
  ...props
}: RegistrationAccordionProps) => {
  return (
    <StyledAccordion expanded={expanded} onChange={onChange} variant="outlined" square {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} data-testid={dataTestId}>
        <StyledIcon>{icon}</StyledIcon>
        <div>
          <Typography variant="h2">{summaryTitle}</Typography>
          <Typography>{summaryDescription}</Typography>
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default RegistrationAccordion;
