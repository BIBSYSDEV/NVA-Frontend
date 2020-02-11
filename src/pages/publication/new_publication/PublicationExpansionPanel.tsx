import React, { ReactNode } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

interface PublicationExpansionPanelProps {
  headerLabel: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
  dataTestId?: string;
}

const StyledPublicationExpansionPanel = styled(ExpansionPanel)`
  margin-bottom: 2rem;
  flex-flow: row wrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  min-height: 5rem;
`;

const StyledIcon = styled.span`
  margin-right: 1rem;
`;

const PublicationExpansionPanel: React.FC<PublicationExpansionPanelProps> = ({
  headerLabel,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
}) => {
  return (
    <StyledPublicationExpansionPanel expanded={expanded} onChange={onChange}>
      <StyledExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={ariaControls}
        data-testid={dataTestId}>
        <StyledIcon>{icon}</StyledIcon> {headerLabel}
      </StyledExpansionPanelSummary>
      {children && <ExpansionPanelDetails>{children}</ExpansionPanelDetails>}
    </StyledPublicationExpansionPanel>
  );
};

export default PublicationExpansionPanel;
