import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { UserList } from './UserList';
import { AddAdminDialog } from './AddAdminDialog';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';

interface CustomerInstitutionAdminsFormProps {
  admins: InstitutionUser[];
  refetchInstitutionUsers: () => void;
  cristinInstitutionId: string;
}

export const CustomerInstitutionAdminsForm = ({
  admins,
  refetchInstitutionUsers,
  cristinInstitutionId,
}: CustomerInstitutionAdminsFormProps) => {
  const { t } = useTranslation();
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {t('basic_data.institutions.administrators')}
      </Typography>

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
          {t('common.add_custom', { name: t('my_page.roles.institution_admin') })}
        </Button>
      </StyledRightAlignedWrapper>
      <AddAdminDialog
        open={openAddAdminModal}
        toggleOpen={toggleOpenAddAdminModal}
        cristinInstitutionId={cristinInstitutionId}
        refetchInstitutionUsers={refetchInstitutionUsers}
      />
    </>
  );
};
