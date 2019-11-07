import React, { ReactNode } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

interface PublicationExpansionPanelProps {
  headerLabel: string;
  icon: ReactNode;
  className?: string;
  id: string;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
}

const StyledPublicationExpansionPanel = styled(ExpansionPanel)`
  padding: 1rem;
  margin-bottom: 2rem;
  min-height: 3.5rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  flex-flow: row wrap;
`;

const StyledIcon = styled.span`
  margin-right: 1rem;
`;

const PublicationExpansionPanel: React.FC<PublicationExpansionPanelProps> = ({
  headerLabel,
  icon,
  id,
  expanded,
  onChange,
  children,
  ariaControls,
}) => {
  return (
    <StyledPublicationExpansionPanel expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} id={id}>
        <StyledIcon>{icon}</StyledIcon> {headerLabel}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </StyledPublicationExpansionPanel>
  );
};

export default PublicationExpansionPanel;
