import React, { FC } from 'react';
import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import styled from 'styled-components';

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

interface PublicationPageProps {
  contributors: Contributor[];
}

const PublicationPageAuthors: FC<PublicationPageProps> = ({ contributors }) => (
  <NormalText>
    {contributors.map((contributor, index) => {
      return <StyledAuthor key={index}>{contributor.identity.name}</StyledAuthor>;
    })}
  </NormalText>
);

export default PublicationPageAuthors;
