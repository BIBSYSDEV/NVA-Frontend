import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types/user.types';
import ButtonModal from './../../components/ButtonModal';

interface UserOrganizationsProps {
  user: User;
}

const UserOrganizations: React.FC<UserOrganizationsProps> = ({ user }) => {
  const { t } = useTranslation('profile');

  return (
    <div>
      <div>
        <ButtonModal
          buttonText={t('organizations.add')}
          dataTestId="add-organization-modal"
          headingText={t('organizations.add_organization')}>
          <div>add organization...</div>
        </ButtonModal>
      </div>
      organizations...
    </div>
  );
};

export default UserOrganizations;
