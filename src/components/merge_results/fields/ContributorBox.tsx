import { Contributor } from '../../../types/contributor.types';
import { ContributorName } from '../../ContributorName';
import { OrganizationBox } from '../../institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../institution/UnconfirmedOrganizationBox';
import { StyledValueBox } from './MissingCompareValues';

interface ContributorBoxProps {
  contributor?: Contributor;
  sx?: object;
}

export const ContributorBox = ({ contributor, sx }: ContributorBoxProps) => {
  return (
    <StyledValueBox sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '0.5rem', ...sx }}>
      {contributor && (
        <>
          <ContributorName
            id={contributor.identity.id}
            name={contributor.identity.name}
            hasVerifiedAffiliation={
              !!contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
            }
            orcId={contributor.identity.orcId}
          />

          {contributor.affiliations?.map((affiliation, index) =>
            affiliation.type === 'Organization' ? (
              <OrganizationBox key={affiliation.id} unitUri={affiliation.id} />
            ) : (
              <UnconfirmedOrganizationBox key={`${affiliation.name}${index}`} name={affiliation.name} />
            )
          )}
        </>
      )}
    </StyledValueBox>
  );
};
