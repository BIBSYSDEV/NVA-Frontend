import React, { FC } from 'react';

import styled from 'styled-components';
import { DummyPublicationListElement } from './MyPublications';
import NormalText from '../../components/NormalText';

const StyledListElement = styled.section`
  display: flex;
  flex-wrap: wrap;
  min-height: 4rem;
  padding: 0.5rem;
`;

const StyledLabel = styled(NormalText)`
  flex: 4;
  min-width: 20rem;
  font-weight: 500;
  padding-right: 2rem;
`;

const StyledStatus = styled(NormalText)`
  flex: 1;
  min-width: 10rem;
`;

const StyledDate = styled(NormalText)`
  flex: 1;
  min-width: 10rem;
`;

interface PublicationListElementProps {
  element: DummyPublicationListElement;
}

const PublicationListElement: FC<PublicationListElementProps> = ({ element, ...props }) => (
  <StyledListElement {...props}>
    <StyledLabel>{element.title}</StyledLabel>
    <StyledStatus>{element.status}</StyledStatus>
    <StyledDate>{element.date}</StyledDate>
  </StyledListElement>
);

export default PublicationListElement;
