import React, { FC, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';
import UserList from './UserList';
import Modal from '../../components/Modal';
import { AddRoleModalContent } from './AddRoleModalContent';

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

interface CustomerInstitutionAdminsFormProps {
  users: InstitutionUser[];
  refetchInstitutionUsers: () => void;
  isLoadingUsers: boolean;
}

const CustomerInstitutionAdminsForm: FC<CustomerInstitutionAdminsFormProps> = ({
  users,
  refetchInstitutionUsers,
  isLoadingUsers,
}) => {
  const { t } = useTranslation('admin');
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  return (
    <Card>
      <Heading>{t('administrators')}</Heading>
      {isLoadingUsers ? (
        <CircularProgress />
      ) : (
        <>
          <UserList
            userList={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)}
            roleToRemove={RoleName.INSTITUTION_ADMIN}
            refetchUsers={refetchInstitutionUsers}
          />
          <StyledNewButton color="primary" variant="outlined" onClick={toggleOpenAddAdminModal}>
            {t('users.add_institution_admin')}
          </StyledNewButton>
        </>
      )}

      <Modal open={openAddAdminModal} onClose={toggleOpenAddAdminModal} headingText={t('users.add_institution_admin')}>
        <AddRoleModalContent
          role={RoleName.INSTITUTION_ADMIN}
          users={users}
          closeModal={toggleOpenAddAdminModal}
          refetchUsers={refetchInstitutionUsers}
        />
      </Modal>
    </Card>
  );
};

export default CustomerInstitutionAdminsForm;
