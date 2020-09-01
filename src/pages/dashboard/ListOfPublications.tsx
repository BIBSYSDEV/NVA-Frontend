import React, { FC } from 'react';
import styled from 'styled-components';
import { List, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { PublicationListItem } from '../../types/publication.types';
import Heading from '../../components/Heading';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';

const StyledListContainer = styled.div`
  padding-bottom: 1rem;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
`;

const StyledNormalText = styled(NormalText)`
  padding-top: 1rem;
`;

interface ListOfPublicationsProps {
  isLoadingPublications: boolean;
  notFoundText: string;
  primaryComponent: React.Component;
  publications: PublicationListItem[];
  secondaryComponent: React.Component;
}

const ListOfPublications: FC<ListOfPublicationsProps> = ({
  isLoadingPublications,
  notFoundText,
  primaryComponent,
  publications,
  secondaryComponent,
}) => (
  <StyledListContainer data-testid="list-of-publications">
    {isLoadingPublications ? (
      <StyledProgressWrapper>
        <CircularProgress />
      </StyledProgressWrapper>
    ) : publications.length > 0 ? (
      <List>
        {publications.map((publication) => (
          <StyledListItem key={publication.identifier}>
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>

            <ListItemText data-testid="result-list-item" primary={primaryComponent} secondary={secondaryComponent} />
          </StyledListItem>
        ))}
      </List>
    ) : (
      <StyledNormalText>{notFoundText}</StyledNormalText>
    )}
  </StyledListContainer>
);

export default ListOfPublications;
