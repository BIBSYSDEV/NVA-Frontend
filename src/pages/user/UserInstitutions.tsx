import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types/user.types';
import ButtonModal from '../../components/ButtonModal';
import InstitutionModal from './InstitutionModal';

interface UserOrganizationsProps {
  user: User;
}

const UserInstitutions: React.FC<UserOrganizationsProps> = ({ user }) => {
  const { t } = useTranslation('profile');

  return (
    <div>
      <div>
        <ButtonModal
          buttonText={t('organizations.add')}
          dataTestId="add-organization-modal"
          headingText={t('organizations.add_organization')}>
          <InstitutionModal />
        </ButtonModal>
      </div>
      organizations...
    </div>
  );
};

export default UserInstitutions;
