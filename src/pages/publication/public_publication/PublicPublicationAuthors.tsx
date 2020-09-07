import React, { FC } from 'react';
import styled from 'styled-components';
import { Link, IconButton } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import { getDistinctContributorUnits } from '../../../utils/institutions-helpers';
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../../utils/constants';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';

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

interface PublicPublicationProps {
  contributors: Contributor[];
}

const PublicPublicationAuthors: FC<PublicPublicationProps> = ({ contributors }) => {
  const distinctUnits = getDistinctContributorUnits(contributors);

  return (
    <>
      <NormalText>
        {contributors.map((contributor, index) => {
          const {
            identity: { arpId, name, orcId },
            email,
          } = contributor;
          const affiliationIndexes = contributor.affiliations
            ?.map((affiliation) => distinctUnits.indexOf(affiliation.id) + 1)
            .sort();

          return (
            <StyledAuthor key={index}>
              {arpId ? <Link href={`/user/${arpId}`}>{name}</Link> : name}
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
          <StyedAffiliationWithIndex key={unitUri}>
            <sup>{index + 1}</sup>
            <AffiliationHierarchy key={unitUri} unitUri={unitUri} commaSeparated />
          </StyedAffiliationWithIndex>
        ))}
      </StyledAffiliationsContainer>
    </>
  );
};

export default PublicPublicationAuthors;
