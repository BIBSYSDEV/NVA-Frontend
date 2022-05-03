import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { filterUsersByRole } from '../../../utils/role-helpers';
import { UserList } from './UserList';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { AddAdminDialog } from './AddAdminDialog';

interface CustomerInstitutionAdminsFormProps {
  users: InstitutionUser[];
  refetchInstitutionUsers: () => void;
  isLoadingUsers: boolean;
  cristinInstitutionId: string;
}

export const CustomerInstitutionAdminsForm = ({
  users,
  refetchInstitutionUsers,
  isLoadingUsers,
  cristinInstitutionId,
}: CustomerInstitutionAdminsFormProps) => {
  const { t } = useTranslation('admin');
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  const addAdminText = t('common:add_custom', { name: t('profile:roles.institution_admin') });

  return (
    <>
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
            variant="contained"
            startIcon={<AddIcon />}
            data-testid="button-open-add-admin"
            onClick={toggleOpenAddAdminModal}>
            {addAdminText}
          </Button>
          <AddAdminDialog
            open={openAddAdminModal}
            toggleOpen={toggleOpenAddAdminModal}
            cristinInstitutionId={cristinInstitutionId}
          />
        </>
      )}
    </>
  );
};
