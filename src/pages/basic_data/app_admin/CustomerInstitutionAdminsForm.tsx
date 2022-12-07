import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { UserList } from './UserList';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { AddAdminDialog } from './AddAdminDialog';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';

interface CustomerInstitutionAdminsFormProps {
  admins: InstitutionUser[];
  refetchInstitutionUsers: () => void;
  isLoadingUsers: boolean;
  cristinInstitutionId: string;
}

export const CustomerInstitutionAdminsForm = ({
  admins,
  refetchInstitutionUsers,
  isLoadingUsers,
  cristinInstitutionId,
}: CustomerInstitutionAdminsFormProps) => {
  const { t } = useTranslation();
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  const addAdminText = t('common.add_custom', { name: t('my_page.roles.institution_admin') });

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {t('basic_data.institutions.administrators')}
      </Typography>
      {isLoadingUsers ? (
        <ListSkeleton />
      ) : (
        <>
          <UserList
            userList={admins}
            roleToRemove={RoleName.InstitutionAdmin}
            refetchUsers={refetchInstitutionUsers}
            tableCaption={t('my_page.roles.institution_admins')}
          />
          <StyledRightAlignedWrapper>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              data-testid="button-open-add-admin"
              onClick={toggleOpenAddAdminModal}>
              {addAdminText}
            </Button>
          </StyledRightAlignedWrapper>
          <AddAdminDialog
            open={openAddAdminModal}
            toggleOpen={toggleOpenAddAdminModal}
            cristinInstitutionId={cristinInstitutionId}
            refetchInstitutionUsers={refetchInstitutionUsers}
          />
        </>
      )}
    </>
  );
};
