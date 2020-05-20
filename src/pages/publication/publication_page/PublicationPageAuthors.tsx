import React, { FC } from 'react';
import styled from 'styled-components';
import { Link, CircularProgress, IconButton } from '@material-ui/core';

import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import useFetchUnitHierarchy from '../../../utils/hooks/useFetchUnitHierarchy';
import { getCommaSeparatedUnitString, getDistinctContributorUnits } from '../../../utils/institutions-helpers';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../../utils/constants';

const StyledAuthor = styled.span`
  margin-right: 1rem;
`;

const StyledAffiliationsContainer = styled.div`
  margin-top: 0.5rem;
  padding-left: 1rem;
`;

interface PublicationPageProps {
  contributors: Contributor[];
}

const PublicationPageAuthors: FC<PublicationPageProps> = ({ contributors }) => {
  const distinctUnits = getDistinctContributorUnits(contributors);

  return (
    <>
      <NormalText>
        {contributors.map((contributor, index) => {
          const {
            identity: { arpId, name, orcId },
            email,
          } = contributor;
          const affiliationIndexes = contributor.affiliations?.map(
            (affiliation) => distinctUnits.indexOf(affiliation.id) + 1
          );
          return (
            <StyledAuthor key={index}>
              {arpId ? <Link href={`/profile/${arpId}`}>{name}</Link> : name}
              <sup>
                {affiliationIndexes?.length > 0 && affiliationIndexes.join(',')}
                {email && (
                  <IconButton size="small" href={`mailto:${email}`}>
                    <MailOutlineIcon fontSize="small" />
                  </IconButton>
                )}
                {orcId && (
                  <IconButton size="small" href={`${ORCID_BASE_URL}/${orcId}`}>
                    <img src={OrcidLogo} height="20" alt="orcid" />
                  </IconButton>
                )}
              </sup>
            </StyledAuthor>
          );
        })}
      </NormalText>
      <StyledAffiliationsContainer>
        {distinctUnits.map((unitUri, index) => (
          <PublicationPageAffiliation key={unitUri} unitUri={unitUri} index={index + 1} />
        ))}
      </StyledAffiliationsContainer>
    </>
  );
};

interface PublicationPageAffiliationProps {
  unitUri: string;
  index: number;
}

const PublicationPageAffiliation: FC<PublicationPageAffiliationProps> = ({ unitUri, index }) => {
  const [unit, isLoadingUnit] = useFetchUnitHierarchy(unitUri);

  return isLoadingUnit ? (
    <CircularProgress size={20} />
  ) : unit ? (
    <NormalText>
      <sup>{index}</sup>
      <i>{getCommaSeparatedUnitString(unit)}</i>
    </NormalText>
  ) : null;
};

export default PublicationPageAuthors;
