import React, { FC } from 'react';

import styled from 'styled-components';
import { DummyPublicationListElement } from './MyPublications';
import PublicationListElement from './PublicationListElement';

interface myProps {
  index: number;
}

const StyledListElement = styled(PublicationListElement)<myProps>`
  background-color: ${props =>
    Boolean(props.index % 2) ? props.theme.palette.background.default : props.theme.palette.box.main};
`;

interface PublicationListProps {
  elements: DummyPublicationListElement[];
}

const PublicationList: FC<PublicationListProps> = ({ elements }) => (
  <>
    {elements.map((element, index) => (
      <StyledListElement key={index} index={index} element={element} />
    ))}
  </>
);

export default PublicationList;
