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

const PublicationPageAuthors: FC<PublicationPageProps> = ({ contributors }) => {
  const distinctUnits = [
    ...new Set(
      contributors
        .map((contributor) => contributor.affiliations)
        .flat()
        .filter((unit) => unit)
        .map((unit) => unit.id)
    ),
  ];

  return (
    <>
      <NormalText>
        {contributors.map((contributor, index) => {
          const { arpId, name } = contributor.identity;
          const affiliationIndexes = contributor.affiliations?.map(
            (affiliation) => distinctUnits.indexOf(affiliation.id) + 1
          );

          return (
            <StyledAuthor key={index}>
              {arpId ? <Link href={`/profile/${arpId}`}>{name}</Link> : name}{' '}
              {affiliationIndexes?.length > 0 && <sup>{affiliationIndexes.join(',')}</sup>}
            </StyledAuthor>
          );
        })}
      </NormalText>
      {distinctUnits.map((unit, index) => (
        <p key={unit}>
          <sup>{index + 1}</sup> {unit}
        </p>
      ))}
    </>
  );
};

export default PublicationPageAuthors;
