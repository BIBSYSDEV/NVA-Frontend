import { InstitutionUser } from '../../../../types/user.types';
import { getFullName } from '../../../../utils/user-helpers';
import { VerticalBox } from '../../../styled/Wrappers';
import { ContactInformationLayout } from './ContactInformationLayout';
import { CuratorName } from './CuratorName';

const MAX_VISIBLE_USERS = 5;
const USER_LIST_MAX_HEIGHT = '9rem';

interface RoleContactInformationProps {
  roleName: string;
  users: InstitutionUser[];
}

export const RoleContactInformation = ({ roleName, users }: RoleContactInformationProps) => {
  return (
    <ContactInformationLayout roleName={roleName}>
      <VerticalBox
        sx={{
          gap: '0.5rem',
          ...(users.length > MAX_VISIBLE_USERS && { maxHeight: USER_LIST_MAX_HEIGHT, overflowY: 'auto' }),
        }}>
        {users.map((user) => (
          <CuratorName
            key={user.username}
            name={getFullName(user.givenName, user.familyName)}
            cristinId={user.cristinId}
          />
        ))}
      </VerticalBox>
    </ContactInformationLayout>
  );
};
