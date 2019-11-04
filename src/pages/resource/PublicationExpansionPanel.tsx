import React, { ReactNode } from 'react';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface PanelProps {
    headerLabel: string;
    icon: ReactNode;
    className: string;
    id: string;
    expanded: boolean;
    onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
    children?: ReactNode;
  }
const PublicationExpansionPanel: React.FC<PanelProps> = ({headerLabel, icon, className, id, expanded, onChange, children}) => {

    return <ExpansionPanel 
        className={className}            
        expanded={expanded}
        onChange={onChange}
    >
        <ExpansionPanelSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id={id}
        >
            {icon} {headerLabel}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            {children}
        </ExpansionPanelDetails>
    </ExpansionPanel>;
}

export default PublicationExpansionPanel;