import { Box, IconButton, ListItemText, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { SearchListItem } from '../../../components/styled/Wrappers';
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { CristinPerson } from '../../../types/user.types';
import { ORCID_BASE_URL } from '../../../utils/constants';
import { getResearchProfilePath } from '../../../utils/urlPaths';
import { filterActiveAffiliations, getFullCristinName, getValueByKey } from '../../../utils/user-helpers';
import { PersonIconHeader } from '../../research_profile/PersonIconHeader';

interface PersonListItemProps {
  person: CristinPerson;
}

export const PersonListItem = ({ person }: PersonListItemProps) => {
  const orcid = getValueByKey('ORCID', person.identifiers);
  const personName = getFullCristinName(person.names);
  const activeAffiliations = filterActiveAffiliations(person.affiliations);

  return (
    <SearchListItem sx={{ borderLeftColor: 'person.main' }}>
      <PersonIconHeader />

      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <ListItemText disableTypography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '600' }}>
            <MuiLink component={Link} to={getResearchProfilePath(person.id)}>
              {personName}
            </MuiLink>
          </Typography>
        </ListItemText>
        {orcid && (
          <IconButton size="small" href={`${ORCID_BASE_URL}/${orcid}`} target="_blank">
            <img src={OrcidLogo} height="20" alt="orcid" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: '0.75rem 1.5rem', flexWrap: 'wrap', width: '100%' }}>
        {activeAffiliations.map((affiliation) => (
          <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
        ))}
      </Box>
    </SearchListItem>
  );
};
