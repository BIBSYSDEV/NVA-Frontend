import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { PublicationListItem } from '../../types/publication.types';

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
`;

interface PublicationListItemComponentProps {
  primaryComponent: ReactNode;
  publication: PublicationListItem;
  secondaryComponent: ReactNode;
}

const PublicationListItemComponent: FC<PublicationListItemComponentProps> = ({
  primaryComponent,
  publication,
  secondaryComponent,
}) => (
  <StyledListItem key={publication.identifier}>
    <ListItemAvatar>
      <Avatar>
        <ImageIcon />
      </Avatar>
    </ListItemAvatar>

    <ListItemText data-testid="result-list-item" primary={primaryComponent} secondary={secondaryComponent} />
  </StyledListItem>
);

export default PublicationListItemComponent;
