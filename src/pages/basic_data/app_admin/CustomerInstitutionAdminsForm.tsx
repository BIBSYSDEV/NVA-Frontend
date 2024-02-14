import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../types/user.types';
import { AddAdminDialog } from './AddAdminDialog';
import { UserList } from './UserList';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../../api/roleApi';

interface CustomerInstitutionAdminsFormProps {
  cristinInstitutionId: string;
  customerInstitutionId: string | undefined;
}

export const CustomerInstitutionAdminsForm = ({
  cristinInstitutionId,
  customerInstitutionId,
}: CustomerInstitutionAdminsFormProps) => {
  const { t } = useTranslation();
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const toggleOpenAddAdminModal = () => {
    setOpenAddAdminModal((state) => !state);
  };

  const adminsQuery = useQuery({
    queryKey: ['institutionAdmins', customerInstitutionId],
    enabled: !!customerInstitutionId,
    queryFn: () => (customerInstitutionId ? fetchUsers(customerInstitutionId, RoleName.InstitutionAdmin) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const admins = adminsQuery.data ?? [];

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {t('basic_data.institutions.administrators')}
      </Typography>

      <UserList userList={admins} refetchUsers={adminsQuery.refetch} />
      {admins.length > 0 && <Typography>{t('basic_data.institutions.administators_list_explanation')}</Typography>}
      <div>
        <Button startIcon={<AddIcon />} data-testid="button-open-add-admin" onClick={toggleOpenAddAdminModal}>
          {t('common.add_custom', { name: t('my_page.roles.institution_admin') })}
        </Button>
      </div>
      <AddAdminDialog
        open={openAddAdminModal}
        toggleOpen={toggleOpenAddAdminModal}
        cristinInstitutionId={cristinInstitutionId}
        refetchInstitutionUsers={adminsQuery.refetch}
      />
    </>
  );
};
