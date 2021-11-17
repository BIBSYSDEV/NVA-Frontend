import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { Button, IconButton, Link, Typography } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../resources/images/orcid_logo.svg';
import { Contributor } from '../../types/contributor.types';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { dataTestId } from '../../utils/dataTestIds';
import { mainRolesPerType, splitContributorsBasedOnRole } from '../../utils/registration-helpers';

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
  const [mainContributors, otherContributors] = splitContributorsBasedOnRole(contributors, registrationType);

  const [showAll, setShowAll] = useState(mainContributors.length === 0);
  const toggleShowAll = () => setShowAll(!showAll);

  const mainContributorsToShow = showAll ? mainContributors : mainContributors.slice(0, 10);
  const mainRoles = mainRolesPerType[registrationType];
  const showRolesForMainContributors = mainRoles && mainRoles.length > 1;
  const otherContributorsToShow = showAll ? otherContributors : [];

  const hiddenContributorsCount = useRef(contributors.length - mainContributorsToShow.length);
  const distinctUnits = getDistinctContributorUnits([...mainContributorsToShow, ...otherContributorsToShow]);

  return (
    <StyledPublicRegistrationAuthors data-testid={dataTestId.registrationLandingPage.contributors}>
      <StyledContributorsGrid>
        <div>
          <ContributorsRow
            contributors={mainContributorsToShow}
            distinctUnits={distinctUnits}
            otherCount={showAll ? undefined : hiddenContributorsCount.current}
            showRole={showRolesForMainContributors}
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
  showRole?: boolean;
  otherCount?: number;
}

const ContributorsRow = ({
  contributors,
  distinctUnits,
  isOtherContributors = false,
  showRole = isOtherContributors,
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
                component={RouterLink}
                to={`/user?id=${encodedId}`}
                data-testid={dataTestId.registrationLandingPage.authorLink(encodedId)}>
                {name}
              </Link>
            ) : (
              name
            )}
            {showRole && ` (${t(`contributors.types.${contributor.role}`)})`}
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
