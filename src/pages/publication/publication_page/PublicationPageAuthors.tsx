import React, { FC } from 'react';
import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import styled from 'styled-components';

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

interface PublicationPageProps {
  authors: Contributor[];
}

const PublicationPageAuthors: FC<PublicationPageProps> = ({ authors }) => {
  return (
    <NormalText>
      {authors.map((author, index) => {
        return <StyledAuthor key={index}>{author.name}</StyledAuthor>;
      })}
    </NormalText>
  );
};

export default PublicationPageAuthors;
