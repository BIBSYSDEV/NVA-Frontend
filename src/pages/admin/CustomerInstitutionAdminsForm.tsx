import React, { useState } from 'react';
import { Button, MuiThemeProvider, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';

import { InstitutionUser, RoleName } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';
import UserList from './UserList';
import Modal from '../../components/Modal';
import { AddRoleModalContent } from './AddRoleModalContent';
import ListSkeleton from '../../components/ListSkeleton';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

interface CustomerInstitutionAdminsFormProps {
  users: InstitutionUser[];
  refetchInstitutionUsers: () => void;
  isLoadingUsers: boolean;
}

export const CustomerInstitutionAdminsForm = ({
  users,
  refetchInstitutionUsers,
  isLoadingUsers,
}: CustomerInstitutionAdminsFormProps) => {
  const { t } = useTranslation('admin');
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
      <Typography variant="h2">{t('administrators')}</Typography>
      {isLoadingUsers ? (
        <ListSkeleton maxWidth={25} />
      ) : (
        <>
          <UserList
            userList={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)}
            roleToRemove={RoleName.INSTITUTION_ADMIN}
            refetchUsers={refetchInstitutionUsers}
          />
          <StyledNewButton
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
            data-testid="button-open-add-admin"
            onClick={toggleOpenAddAdminModal}>
            {t('users.add_institution_admin')}
          </StyledNewButton>
        </>
      )}

      <MuiThemeProvider theme={lightTheme}>
        <Modal
          open={openAddAdminModal}
          onClose={toggleOpenAddAdminModal}
          headingText={t('users.add_institution_admin')}
          dataTestId="add-role-modal">
          <AddRoleModalContent
            role={RoleName.INSTITUTION_ADMIN}
            users={users}
            closeModal={toggleOpenAddAdminModal}
            refetchUsers={refetchInstitutionUsers}
          />
        </Modal>
      </MuiThemeProvider>
    </BackgroundDiv>
  );
};
