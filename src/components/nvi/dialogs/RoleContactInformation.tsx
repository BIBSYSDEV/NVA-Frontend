import { InstitutionUser } from '../../../types/user.types';
import { getFullName } from '../../../utils/user-helpers';
import { VerticalBox } from '../../styled/Wrappers';
import { ContactInformationLayout } from './ContactInformationLayout';
import { CuratorName } from './CuratorName';

interface RoleContactInformationProps {
  roleName: string;
  users: InstitutionUser[];
}

export const RoleContactInformation = ({ roleName, users }: RoleContactInformationProps) => {
  return (
    <ContactInformationLayout roleName={roleName}>
      {users.length === 1 ? (
        <CuratorName name={getFullName(users[0].givenName, users[0].familyName)} cristinId={users[0].cristinId} />
      ) : (
        <VerticalBox sx={{ gap: '0.5rem', ...(users.length > 5 && { maxHeight: '9rem', overflowY: 'auto' }) }}>
          {users.map((user) => (
            <CuratorName
              key={user.username}
              name={getFullName(user.givenName, user.familyName)}
              cristinId={user.cristinId}
            />
          ))}
        </VerticalBox>
      )}
    </ContactInformationLayout>
  );
};
