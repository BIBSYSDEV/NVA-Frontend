import { Typography } from '@mui/material';
import { InstitutionUser } from '../../../../types/user.types';
import { getFullName } from '../../../../utils/user-helpers';
import { ResearchProfileLink } from '../../../_atoms/ResearchProfileLink';
import { VerticalBox } from '../../../styled/Wrappers';

interface ContactInformationProps {
  roleName: string;
  users: InstitutionUser[];
}

export const ContactInformationBox = ({ roleName, users }: ContactInformationProps) => {
  return (
    <VerticalBox sx={{ gap: '0.25rem' }}>
      <Typography variant="h2">{roleName}</Typography>
      <VerticalBox
        component="ul"
        sx={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '0.5rem',
          ...(users.length > 5 && { maxHeight: '9rem', overflowY: 'auto' }),
        }}>
        {users.map((user) => (
          <li key={user.username}>
            <ResearchProfileLink name={getFullName(user.givenName, user.familyName)} cristinId={user.cristinId} />
          </li>
        ))}
      </VerticalBox>
    </VerticalBox>
  );
};
