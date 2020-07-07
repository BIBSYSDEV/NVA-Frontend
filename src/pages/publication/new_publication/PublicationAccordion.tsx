import React, { ReactNode } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

interface PublicationAccordionProps {
  headerLabel: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
  dataTestId?: string;
}

const StyledPublicationAccordion = styled(Accordion)`
  margin-bottom: 2rem;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  min-height: 5rem;
`;

const StyledIcon = styled.span`
  margin-right: 1rem;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const PublicationAccordion: React.FC<PublicationAccordionProps> = ({
  headerLabel,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
}) => {
  return (
    <StyledPublicationAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} data-testid={dataTestId}>
        <StyledIcon>{icon}</StyledIcon> {headerLabel}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledPublicationAccordion>
  );
};

export default PublicationAccordion;
