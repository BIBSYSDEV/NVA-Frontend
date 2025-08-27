import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Link, Skeleton } from '@mui/material';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { ContributorName } from '../../../components/ContributorName';
import { Contributor } from '../../../types/contributor.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface ContactPersonRowProps {
  contributor: Contributor;
}

export const ContactPersonRow = ({ contributor }: ContactPersonRowProps) => {
  const id = contributor.identity.id ?? '';
  const personQuery = useFetchPerson(id);
  const person = personQuery.data;

  return (
    <li style={{ marginBottom: '1rem', marginLeft: 0, listStyleType: 'none' }}>
      {personQuery.isFetching ? (
        <>
          <Skeleton width="10rem" />
          <Skeleton width="10rem" />
        </>
      ) : (
        <>
          <ContributorName
            id={id}
            name={contributor.identity.name}
            hasVerifiedAffiliation={
              !!contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
            }
          />
          {person?.contactDetails?.email && (
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <MailOutlineIcon />
              <Link
                data-testid={dataTestId.registrationLandingPage.detailsTab.emailLink(id)}
                href={`mailto:${person.contactDetails.email}`}>
                {person.contactDetails.email}
              </Link>
            </Box>
          )}
        </>
      )}
    </li>
  );
};
