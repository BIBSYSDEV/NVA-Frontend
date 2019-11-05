import React, { ReactNode } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface PublicationExpansionPanelProps {
  headerLabel: string;
  icon: ReactNode;
  className: string;
  id: string;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
}

const PublicationExpansionPanel: React.FC<PublicationExpansionPanelProps> = ({
  headerLabel,
  icon,
  className,
  id,
  expanded,
  onChange,
  children,
  ariaControls,
}) => {
  return (
    <ExpansionPanel className={className} expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} id={id}>
        {icon} {headerLabel}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default PublicationExpansionPanel;
