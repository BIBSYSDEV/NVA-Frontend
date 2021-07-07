import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, Link, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../resources/images/orcid_logo.svg';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { BookType } from '../../types/publicationFieldNames';
import { dataTestId } from '../../utils/dataTestIds';

const StyledContributorsGrid = styled.div`
  display: grid;
  align-items: start;
  grid-template-columns: 1fr auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

const StyledAffiliationsList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem;
`;

const StyedAffiliationListItem = styled.li`
  display: flex;
`;

const StyledPublicRegistrationAuthors = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid;
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

  const hiddenContributorsCount = useRef(contributors.length - mainContributorsToShow.length);
  const distinctUnits = getDistinctContributorUnits([...mainContributorsToShow, ...otherContributorsToShow]);

  return (
    <StyledPublicRegistrationAuthors>
      <StyledContributorsGrid>
        <div>
          <ContributorsRow
            contributors={mainContributorsToShow}
            distinctUnits={distinctUnits}
            otherCount={showAll ? undefined : hiddenContributorsCount.current}
          />
          {showAll && otherContributorsToShow.length > 0 && (
            <ContributorsRow contributors={otherContributorsToShow} distinctUnits={distinctUnits} isOtherContributors />
          )}
        </div>
        {hiddenContributorsCount.current > 0 && (
          <Button
            startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleShowAll}
            variant="outlined">
            {showAll ? t('common:show_fewer') : t('common:show_all')}
          </Button>
        )}
      </StyledContributorsGrid>

      <StyledAffiliationsList>
        {distinctUnits.map((unitUri, index) => (
          <StyedAffiliationListItem key={unitUri}>
            <sup>{index + 1}</sup>
            <AffiliationHierarchy key={unitUri} unitUri={unitUri} commaSeparated />
          </StyedAffiliationListItem>
        ))}
      </StyledAffiliationsList>
    </StyledPublicRegistrationAuthors>
  );
};

const StyledContributorsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  > :not(:first-child) {
    margin-left: 1rem;
  }
`;

interface ContributorsRowProps {
  contributors: Contributor[];
  distinctUnits: string[];
  isOtherContributors?: boolean;
  otherCount?: number;
}

const ContributorsRow = ({
  contributors,
  distinctUnits,
  isOtherContributors = false,
  otherCount,
}: ContributorsRowProps) => {
  const { t } = useTranslation('registration');

  return (
    <StyledContributorsList>
      {isOtherContributors && <Typography component="li">{t('heading.contributors')}:</Typography>}
      {contributors.map((contributor, index) => {
        const {
          identity: { id, name, orcId },
        } = contributor;
        const affiliationIndexes = contributor.affiliations
          ?.map((affiliation) => affiliation.id && distinctUnits.indexOf(affiliation.id) + 1)
          .filter((affiliationIndex) => affiliationIndex)
          .sort();
        const encodedId = id ? encodeURIComponent(id) : '';

        return (
          <Typography key={index} component="li">
            {id ? (
              <Link
                href={`/user?id=${encodedId}`}
                data-testid={dataTestId.registrationLandingPage.authorLink(encodedId)}>
                {name}
              </Link>
            ) : (
              name
            )}
            {isOtherContributors && ` (${t(`contributors.types.${contributor.role}`)})`}
            {(orcId || (affiliationIndexes && affiliationIndexes.length > 0)) && (
              <sup>
                {affiliationIndexes && affiliationIndexes.length > 0 && affiliationIndexes.join(',')}
                {orcId && (
                  <IconButton size="small" href={orcId} target="_blank">
                    <img src={OrcidLogo} height="20" alt="orcid" />
                  </IconButton>
                )}
              </sup>
            )}
          </Typography>
        );
      })}
      {otherCount && otherCount > 0 ? (
        <Typography component="li">{t('public_page.other_contributors', { count: otherCount })}</Typography>
      ) : null}
    </StyledContributorsList>
  );
};
