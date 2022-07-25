import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { Modal } from '../../../components/Modal';
import { PageHeader } from '../../../components/PageHeader';
import { RootState } from '../../../redux/store';
import { RoleName, UserList as UserListType } from '../../../types/user.types';
import { filterUsersByRole } from '../../../utils/role-helpers';
import { UserList } from '../app_admin/UserList';
import { dataTestId } from '../../../utils/dataTestIds';
import { useFetch } from '../../../utils/hooks/useFetch';
import { RoleApiPath } from '../../../api/apiPaths';
import { AddRoleModalContent } from '../app_admin/AddRoleModalContent';

const StyledContainer = styled('div')({
  marginBottom: '1rem',
});

const StyledNewButton = styled(Button)({
  marginTop: '1rem',
});

export const MyInstitutionUsersPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [institutionUsers, isLoading, fetchInstitutionUsers] = useFetch<UserListType>({
    url: user?.customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(user.customerId)}` : '',
    errorMessage: t('feedback.error.get_users_for_institution'),
    withAuthentication: true,
  });
  const users = institutionUsers?.users ?? [];
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);
  const [roleToAdd, setRoleToAdd] = useState<RoleName>();

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  const roleToAddTitle = t('common.add_custom', {
    name: t(`my_page.roles.${roleToAdd?.toLowerCase().replace('-', '_')}`),
  });

  return (
    <>
      <PageHeader>{t('basic_data.users.user_administration')}</PageHeader>
      {/* Admins */}
      <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersAdministrators}>
        <Typography variant="h3" component="h2">
          {t('my_page.roles.institution_admins')}
        </Typography>
        <Divider />
        {isLoading ? (
          <ListSkeleton maxWidth={25} />
        ) : (
          <UserList
            userList={filterUsersByRole(users, RoleName.InstitutionAdmin)}
            roleToRemove={RoleName.InstitutionAdmin}
            refetchUsers={fetchInstitutionUsers}
            tableCaption={t('my_page.roles.institution_admins')}
          />
        )}
        <StyledNewButton
          variant="outlined"
          startIcon={<AddIcon />}
          data-testid="button-add-institution-admin"
          onClick={() => setRoleToAdd(RoleName.InstitutionAdmin)}>
          {t('common.add_custom', { name: t('my_page.roles.institution_admin') })}
        </StyledNewButton>
      </StyledContainer>

      {/* Curators */}
      <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersCurators}>
        <Typography variant="h3" component="h2">
          {t('my_page.roles.curators')}
        </Typography>
        <Divider />
        {isLoading ? (
          <ListSkeleton maxWidth={25} />
        ) : (
          <UserList
            userList={filterUsersByRole(users, RoleName.Curator)}
            roleToRemove={RoleName.Curator}
            refetchUsers={fetchInstitutionUsers}
            tableCaption={t('my_page.roles.curators')}
            showScope
          />
        )}
        <StyledNewButton
          variant="outlined"
          startIcon={<AddIcon />}
          data-testid="button-add-curator"
          onClick={() => setRoleToAdd(RoleName.Curator)}>
          {t('common.add_custom', { name: t('my_page.roles.curator') })}
        </StyledNewButton>
      </StyledContainer>

      {/* Editors */}
      <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersEditors}>
        <Typography variant="h3" component="h2">
          {t('my_page.roles.editors')}
        </Typography>
        <Divider />
        {isLoading ? (
          <ListSkeleton maxWidth={25} />
        ) : (
          <UserList
            userList={filterUsersByRole(users, RoleName.Editor)}
            roleToRemove={RoleName.Editor}
            refetchUsers={fetchInstitutionUsers}
            tableCaption={t('my_page.roles.editors')}
          />
        )}
        <StyledNewButton
          variant="outlined"
          startIcon={<AddIcon />}
          data-testid="button-add-editor"
          onClick={() => setRoleToAdd(RoleName.Editor)}>
          {t('common.add_custom', { name: t('my_page.roles.editor') })}
        </StyledNewButton>
      </StyledContainer>

      <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersCreators}>
        <Typography variant="h3" component="h2">
          {t('my_page.roles.creator')}
        </Typography>
        <Divider />
        <Typography>{t('basic_data.users.creator_info')}</Typography>
        <FormControlLabel
          control={<Checkbox disabled checked={autoAssignCreators} data-testid="checkbox-assign-creators" />}
          onChange={handleCheckAutoAssignCreators}
          label={t('basic_data.users.auto_assign_creators')}
        />
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
