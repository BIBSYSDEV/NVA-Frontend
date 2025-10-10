import { List, SxProps } from '@mui/material';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RegistrationSearchItem } from '../../../types/registration.types';

interface ListRegistrationRelationsProps {
  registrations: RegistrationSearchItem[];
  sx?: SxProps;
}

export const ListRegistrationRelations = ({ registrations, sx }: ListRegistrationRelationsProps) => (
  <List disablePadding sx={{ width: '100%', ...sx }}>
    {registrations.map((registration) => (
      <SearchListItem key={registration.identifier}>
        <RegistrationListItemContent registration={registration} />
      </SearchListItem>
    ))}
  </List>
);
