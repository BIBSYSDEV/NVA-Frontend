import React, { ReactNode, FC } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

interface RegistrationAccordionProps {
  headerLabel: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
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

const RegistrationAccordion: FC<RegistrationAccordionProps> = ({
  headerLabel,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
}) => {
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
