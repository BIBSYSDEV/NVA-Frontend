import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
`;

interface RegistrationListItemProps {
  primaryComponent: ReactNode;
  secondaryComponent?: ReactNode;
}

const RegistrationListItem: FC<RegistrationListItemProps> = ({ primaryComponent, secondaryComponent }) => (
  <StyledListItem>
    <ListItemAvatar>
      <Avatar>
        <ImageIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText data-testid="result-list-item" primary={primaryComponent} secondary={secondaryComponent} />
  </StyledListItem>
);

export default RegistrationListItem;
