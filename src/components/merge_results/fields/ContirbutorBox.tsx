import { Contributor } from '../../../types/contributor.types';
import { ContributorName } from '../../ContributorName';
import { StyledValueBox } from './MissingCompareValues';

interface ContributorBoxProps {
  contributor?: Contributor;
  sx?: object;
}

export const ContributorBox = ({ contributor, sx }: ContributorBoxProps) => {
  return (
    <StyledValueBox sx={sx}>
      {contributor && (
        <ContributorName
          id={contributor.identity.id}
          name={contributor.identity.name}
          hasVerifiedAffiliation={
            !!contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
          }
          orcId={contributor.identity.orcId}
        />
      )}
    </StyledValueBox>
  );
};
