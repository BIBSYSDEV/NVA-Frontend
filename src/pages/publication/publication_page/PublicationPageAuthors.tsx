import React, { FC } from 'react';
import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import styled from 'styled-components';

const StyledAuthors = styled(NormalText)``;

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

interface PublicationPageProps {
  authors: Contributor[];
}

const PublicationPageAuthors: FC<PublicationPageProps> = ({ authors }) => {
  return (
    <StyledAuthors>
      {authors.map((author, index) => {
        return <StyledAuthor key={index}>{author.name}</StyledAuthor>;
      })}
    </StyledAuthors>
  );
};

export default PublicationPageAuthors;
