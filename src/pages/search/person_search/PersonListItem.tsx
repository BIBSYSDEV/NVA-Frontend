import { ListItem, ListItemText, Typography, Link as MuiLink, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { CristinPerson } from '../../../types/user.types';
import { getResearchProfilePath } from '../../../utils/urlPaths';
import { filterActiveAffiliations, getValueByKey } from '../../../utils/user-helpers';
import { ORCID_BASE_URL } from '../../../utils/constants';

interface PersonListItemProps {
  person: CristinPerson;
}

export const PersonListItem = ({ person }: PersonListItemProps) => {
  const orcid = getValueByKey('ORCID', person.identifiers);
  const firstName = getValueByKey('FirstName', person.names);
  const lastName = getValueByKey('LastName', person.names);
  const activeAffiliations = filterActiveAffiliations(person.affiliations);

  return (
    <ListItem
      key={person.id}
      sx={{
        border: '2px solid',
        borderLeft: '1.25rem solid',
        borderColor: 'person.main',
        flexDirection: 'column',
        alignItems: 'start',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <ListItemText disableTypography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '600' }}>
            <MuiLink component={Link} to={getResearchProfilePath(person.id)}>
              {firstName} {lastName}
            </MuiLink>
          </Typography>
        </ListItemText>
        {orcid && (
          <IconButton size="small" href={`${ORCID_BASE_URL}/${orcid}`} target="_blank">
            <img src={OrcidLogo} height="20" alt="orcid" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
        {activeAffiliations.map((affiliation) => (
          <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
        ))}
      </Box>
    </ListItem>
  );
};
