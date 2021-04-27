import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, Link, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AffiliationHierarchy from '../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../resources/images/orcid_logo.svg';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { BookType } from '../../types/publicationFieldNames';
import { useTranslation } from 'react-i18next';

const StyledMainContributorsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
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
  const { t } = useTranslation('registration');
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll(!showAll);

  const mainContributors =
    registrationType === BookType.ANTHOLOGY
      ? contributors.filter((contributor) => contributor.role === ContributorRole.Editor)
      : contributors.filter((contributor) => contributor.role === ContributorRole.Creator);
  const mainContributorsToShow = showAll ? mainContributors : mainContributors.slice(0, 10);

  const otherContributors =
    registrationType === BookType.ANTHOLOGY
      ? contributors.filter((contributor) => contributor.role !== ContributorRole.Editor)
      : contributors.filter((contributor) => contributor.role !== ContributorRole.Creator);
  const otherContributorsToShow = showAll ? otherContributors : [];

  const hiddenContributorsCount = useRef(showAll ? 0 : contributors.length - mainContributorsToShow.length);
  const distinctUnits = getDistinctContributorUnits([...mainContributorsToShow, ...otherContributorsToShow]);

  return (
    <StyledPublicRegistrationAuthors>
      <StyledMainContributorsRow>
        <ContributorsRow contributors={mainContributorsToShow} distinctUnits={distinctUnits} />
        {hiddenContributorsCount.current > 0 && (
          <Button
            startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleShowAll}
            variant="outlined">
            {showAll
              ? t('public_page.minimize_contributors')
              : t('public_page.show_all_contributors', { count: hiddenContributorsCount.current })}
          </Button>
        )}
      </StyledMainContributorsRow>
      {showAll && <ContributorsRow contributors={otherContributorsToShow} distinctUnits={distinctUnits} />}

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

const StyledContributorsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  > :not(:first-child) {
    margin-left: 1rem;
  }
`;

interface ContributorsRowProps {
  contributors: Contributor[];
  distinctUnits: any;
}

const ContributorsRow = ({ contributors, distinctUnits }: ContributorsRowProps) => (
  <StyledContributorsList>
    {contributors.map((contributor, index) => {
      const {
        identity: { id, name, orcId },
      } = contributor;
      const affiliationIndexes = contributor.affiliations
        ?.map((affiliation) => affiliation.id && distinctUnits.indexOf(affiliation.id) + 1)
        .filter((affiliationIndex) => affiliationIndex)
        .sort();

      return (
        <Typography key={index} component="li">
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
        </Typography>
      );
    })}
  </StyledContributorsList>
);
