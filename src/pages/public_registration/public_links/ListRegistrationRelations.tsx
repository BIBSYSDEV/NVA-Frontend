import { List } from '@mui/material';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RegistrationSearchItem } from '../../../types/registration.types';

interface ListRegistrationRelationsProps {
  registrations: RegistrationSearchItem[];
}

export const ListRegistrationRelations = ({ registrations }: ListRegistrationRelationsProps) => (
  <List disablePadding sx={{ width: '100%' }}>
    {registrations.map((registration) => (
      <SearchListItem sx={{ borderLeftColor: 'registration.main' }} key={registration.id}>
        <RegistrationListItemContent registration={registration} />
      </SearchListItem>
    ))}
  </List>
);
