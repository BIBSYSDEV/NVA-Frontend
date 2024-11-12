import { Link, List, ListItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { getTitleString } from '../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';

interface ListRegistrationRelationsProps {
  registrations: RegistrationSearchItem[];
}

export const ListRegistrationRelations = ({ registrations }: ListRegistrationRelationsProps) => (
  <List disablePadding>
    {registrations.map((registration) => (
      <ListItem disableGutters key={registration.identifier}>
        <Link component={RouterLink} to={getRegistrationLandingPagePath(registration.identifier)}>
          {getTitleString(registration.entityDescription?.mainTitle)}
        </Link>
      </ListItem>
    ))}
  </List>
);
