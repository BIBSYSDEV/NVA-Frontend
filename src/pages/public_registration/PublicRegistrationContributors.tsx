import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, Link, Typography } from '@material-ui/core';
import AffiliationHierarchy from '../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../resources/images/orcid_logo.svg';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { BookType } from '../../types/publicationFieldNames';

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

const StyledAffiliationsContainer = styled.div`
  margin-top: 0.5rem;
  padding-left: 1rem;

  > div:not(:first-child) {
    margin-top: 0.2rem;
  }
`;

const StyedAffiliationWithIndex = styled.div`
  display: flex;
`;

const StyledPublicRegistrationAuthors = styled.div`
  margin-bottom: 1rem;
`;

interface PublicRegistrationContributorsProps {
  contributors: Contributor[];
  registrationType: string;
}

export const PublicRegistrationContributors = ({
  contributors,
  registrationType,
}: PublicRegistrationContributorsProps) => {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll(!showAll);

  const mainContributors =
    registrationType === BookType.ANTHOLOGY
      ? contributors.filter((contributor) => contributor.role === ContributorRole.Editor)
      : contributors.filter((contributor) => contributor.role === ContributorRole.Creator);
  const mainContributorsToShow = showAll ? mainContributors : mainContributors.slice(0, 5);

  const otherContributors =
    registrationType === BookType.ANTHOLOGY
      ? contributors.filter((contributor) => contributor.role !== ContributorRole.Editor)
      : contributors.filter((contributor) => contributor.role !== ContributorRole.Creator);
  const otherContributorsToShow = showAll ? otherContributors : [];

  const distinctUnits = getDistinctContributorUnits([...mainContributorsToShow, ...otherContributorsToShow]);

  return (
    <StyledPublicRegistrationAuthors>
      <ContributorsRow contributors={mainContributorsToShow} distinctUnits={distinctUnits} />
      {showAll && <ContributorsRow contributors={otherContributorsToShow} distinctUnits={distinctUnits} />}
      <Button onClick={toggleShowAll}>{showAll ? 'Minimer' : 'Vis alle'}</Button>

      <StyledAffiliationsContainer>
        {distinctUnits.map((unitUri, index) => (
          <StyedAffiliationWithIndex key={unitUri}>
            <sup>{index + 1}</sup>
            <AffiliationHierarchy key={unitUri} unitUri={unitUri} commaSeparated />
          </StyedAffiliationWithIndex>
        ))}
      </StyledAffiliationsContainer>
    </StyledPublicRegistrationAuthors>
  );
};

interface ContributorsRowProps {
  contributors: Contributor[];
  distinctUnits: any;
}

const ContributorsRow = ({ contributors, distinctUnits }: ContributorsRowProps) => {
  return (
    <Typography>
      {contributors.map((contributor, index) => {
        const {
          identity: { id, name, orcId },
        } = contributor;
        const affiliationIndexes = contributor.affiliations
          ?.map((affiliation) => affiliation.id && distinctUnits.indexOf(affiliation.id) + 1)
          .filter((affiliationIndex) => affiliationIndex)
          .sort();

        return (
          <StyledAuthor key={index}>
            {id ? (
              <Link
                href={`/user?id=${encodeURIComponent(id)}`}
                data-testid={`presentation-author-link-${encodeURIComponent(id)}`}>
                {name}
              </Link>
            ) : (
              name
            )}
            <sup>
              {affiliationIndexes && affiliationIndexes.length > 0 && affiliationIndexes.join(',')}
              {orcId && (
                <IconButton size="small" href={orcId}>
                  <img src={OrcidLogo} height="20" alt="orcid" />
                </IconButton>
              )}
            </sup>
          </StyledAuthor>
        );
      })}
    </Typography>
  );
};
