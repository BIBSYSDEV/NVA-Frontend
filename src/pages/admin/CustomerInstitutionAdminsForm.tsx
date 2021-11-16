import React, { useState } from 'react';
import { Button, ThemeProvider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';
import { UserList } from './UserList';
import { Modal } from '../../components/Modal';
import { AddRoleModalContent } from './AddRoleModalContent';
import { ListSkeleton } from '../../components/ListSkeleton';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { lightTheme } from '../../themes/lightTheme';

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

  const addAdminText = t('common:add_custom', { name: t('profile:roles.institution_admin') });

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
            tableCaption={t('profile:roles.institution_admins')}
          />
          <Button
            sx={{ mt: '1rem' }}
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
            data-testid="button-open-add-admin"
            onClick={toggleOpenAddAdminModal}>
            {addAdminText}
          </Button>
        </>
      )}

      <ThemeProvider theme={lightTheme}>
        <Modal
          open={openAddAdminModal}
          onClose={toggleOpenAddAdminModal}
          headingText={addAdminText}
          dataTestId="add-role-modal">
          <AddRoleModalContent
            role={RoleName.INSTITUTION_ADMIN}
            users={users}
            closeModal={toggleOpenAddAdminModal}
            refetchUsers={refetchInstitutionUsers}
            tableCaption={addAdminText}
          />
        </Modal>
      </ThemeProvider>
    </BackgroundDiv>
  );
};
