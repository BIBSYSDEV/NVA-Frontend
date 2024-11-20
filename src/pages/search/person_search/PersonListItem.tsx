import PersonIcon from '@mui/icons-material/Person';
import { Box, IconButton, ListItemText, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { SearchListItem } from '../../../components/styled/Wrappers';
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { CristinPerson } from '../../../types/user.types';
import { ORCID_BASE_URL } from '../../../utils/constants';
import { getResearchProfilePath } from '../../../utils/urlPaths';
import { filterActiveAffiliations, getFullCristinName, getValueByKey } from '../../../utils/user-helpers';

interface PersonListItemProps {
  person: CristinPerson;
}

export const PersonListItem = ({ person }: PersonListItemProps) => {
  const { t } = useTranslation();
  const orcid = getValueByKey('ORCID', person.identifiers);
  const personName = getFullCristinName(person.names);
  const activeAffiliations = filterActiveAffiliations(person.affiliations);

  return (
    <SearchListItem sx={{ borderLeftColor: 'person.main' }}>
      <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        <PersonIcon sx={{ bgcolor: 'person.main', borderRadius: '0.25rem' }} />
        <Typography>{t('common.person')}</Typography>
      </Box>

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

      <Box sx={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
        {activeAffiliations.map((affiliation) => (
          <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
        ))}
      </Box>
    </SearchListItem>
  );
};
