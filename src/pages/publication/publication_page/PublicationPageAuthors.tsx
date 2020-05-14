import React, { FC } from 'react';
import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import styled from 'styled-components';
import { Link } from '@material-ui/core';

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

interface PublicationPageProps {
  contributors: Contributor[];
}

const PublicationPageAuthors: FC<PublicationPageProps> = ({ contributors }) => (
  <NormalText>
    {contributors.map((contributor, index) => {
      const { arpId, name } = contributor.identity;
      return <StyledAuthor key={index}>{arpId ? <Link href={`/profile/${arpId}`}>{name}</Link> : name}</StyledAuthor>;
    })}
  </NormalText>
);

export default PublicationPageAuthors;
