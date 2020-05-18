import React, { FC } from 'react';
import styled from 'styled-components';
import { Link, CircularProgress } from '@material-ui/core';

import { Contributor } from '../../../types/contributor.types';
import NormalText from '../../../components/NormalText';
import useFetchUnitHierarchy from '../../../utils/hooks/useFetchUnitHierarchy';
import { getCommaSeparatedUnitString, getDistinctContributorUnits } from '../../../utils/institutions-helpers';

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
          const { arpId, name } = contributor.identity;
          const affiliationIndexes = contributor.affiliations?.map(
            (affiliation) => distinctUnits.indexOf(affiliation.id) + 1
          );

          return (
            <StyledAuthor key={index}>
              {arpId ? <Link href={`/profile/${arpId}`}>{name}</Link> : name}
              {affiliationIndexes?.length > 0 && <sup>{affiliationIndexes.join(',')}</sup>}
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
