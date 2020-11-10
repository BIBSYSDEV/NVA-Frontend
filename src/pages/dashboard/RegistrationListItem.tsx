import React, { FC, ReactNode } from 'react';
import { ListItemText, ListItem } from '@material-ui/core';

interface RegistrationListItemProps {
  primaryComponent: ReactNode;
  secondaryComponent?: ReactNode;
}

const RegistrationListItem: FC<RegistrationListItemProps> = ({ primaryComponent, secondaryComponent }) => (
  <ListItem divider>
    <ListItemText data-testid="result-list-item" primary={primaryComponent} secondary={secondaryComponent} />
  </ListItem>
);

export default RegistrationListItem;
