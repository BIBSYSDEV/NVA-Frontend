import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { Modal } from '../../../components/Modal';
import { RootState } from '../../../redux/store';
import { RoleName, UserList as CuratorListType } from '../../../types/user.types';
import { filterUsersByRole } from '../../../utils/role-helpers';
import { CuratorList } from '../../editor/CuratorList';
import { dataTestId } from '../../../utils/dataTestIds';
import { useFetch } from '../../../utils/hooks/useFetch';
import { RoleApiPath } from '../../../api/apiPaths';
import { AddRoleModalContent } from '../app_admin/AddRoleModalContent';

const StyledContainer = styled('div')({
  marginBottom: '1rem',
});

export const MyInstitutionUsersPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [institutionUsers, isLoading, fetchInstitutionUsers] = useFetch<CuratorListType>({
    url: user?.customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(user.customerId)}` : '',
    errorMessage: t('feedback.error.get_users_for_institution'),
    withAuthentication: true,
  });
  const users = institutionUsers?.users ?? [];
  const [roleToAdd, setRoleToAdd] = useState<RoleName>();

  const roleToAddTitle = t('common.add_custom', {
    name: t(`my_page.roles.${roleToAdd?.toLowerCase().replace('-', '_')}` as any),
  });

  return (
    <>
      <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersCurators}>
        <Typography variant="h3" component="h2">
          {t('my_page.roles.curators')}
        </Typography>
        <Divider />
        {isLoading ? (
          <ListSkeleton maxWidth={25} />
        ) : (
          <CuratorList
            userList={filterUsersByRole(users, RoleName.Curator)}
            refetchUsers={fetchInstitutionUsers}
            tableCaption={t('my_page.roles.curators')}
            showScope
          />
        )}
      </StyledContainer>

      {roleToAdd && (
        <Modal
          open={true}
          onClose={() => setRoleToAdd(undefined)}
          headingText={roleToAddTitle}
          dataTestId="add-role-modal">
          <AddRoleModalContent
            role={roleToAdd}
            users={users}
            closeModal={() => setRoleToAdd(undefined)}
            refetchUsers={fetchInstitutionUsers}
            tableCaption={roleToAddTitle}
          />
        </Modal>
      )}
    </>
  );
};
