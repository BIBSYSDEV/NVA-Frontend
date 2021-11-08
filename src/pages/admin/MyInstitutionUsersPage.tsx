import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Card } from '../../components/Card';
import { ListSkeleton } from '../../components/ListSkeleton';
import { Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';
import { AddRoleModalContent } from './AddRoleModalContent';
import { UserList } from './UserList';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { RoleApiPath } from '../../api/apiPaths';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

const MyInstitutionUsersPage = () => {
  const { t } = useTranslation('admin');
  const user = useSelector((store: RootStore) => store.user);
  const [institutionUsers, isLoading, fetchInstitutionUsers] = useFetch<InstitutionUser[]>({
    url: user?.customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(user.customerId)}` : '',
    errorMessage: t('feedback:error.get_users_for_institution'),
    withAuthentication: true,
  });
  const users = institutionUsers ?? [];
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);
  const [roleToAdd, setRoleToAdd] = useState<RoleName>();

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  const roleToAddTitle = t('common:add_custom', { name: roleToAdd });

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('users.user_administration')}</PageHeader>
      <Card>
        {/* Admins */}
        <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersAdministrators}>
          <Typography variant="h3" component="h2">
            {t('profile:roles.institution_admins')}
          </Typography>
          <Divider />
          {isLoading ? (
            <ListSkeleton maxWidth={25} />
          ) : (
            <UserList
              userList={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)}
              roleToRemove={RoleName.INSTITUTION_ADMIN}
              refetchUsers={fetchInstitutionUsers}
              tableCaption={t('profile:roles.institution_admins')}
            />
          )}
          <StyledNewButton
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
            data-testid="button-add-institution-admin"
            onClick={() => setRoleToAdd(RoleName.INSTITUTION_ADMIN)}>
            {t('users.add_institution_admin')}
          </StyledNewButton>
        </StyledContainer>

        {/* Curators */}
        <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersCurators}>
          <Typography variant="h3" component="h2">
            {t('profile:roles.curators')}
          </Typography>
          <Divider />
          {isLoading ? (
            <ListSkeleton maxWidth={25} />
          ) : (
            <UserList
              userList={filterUsersByRole(users, RoleName.CURATOR)}
              roleToRemove={RoleName.CURATOR}
              refetchUsers={fetchInstitutionUsers}
              tableCaption={t('profile:roles.curators')}
            />
          )}
          <StyledNewButton
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
            data-testid="button-add-curator"
            onClick={() => setRoleToAdd(RoleName.CURATOR)}>
            {t('users.add_curator')}
          </StyledNewButton>
        </StyledContainer>

        {/* Editors */}
        <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersEditors}>
          <Typography variant="h3" component="h2">
            {t('profile:roles.editors')}
          </Typography>
          <Divider />
          {isLoading ? (
            <ListSkeleton maxWidth={25} />
          ) : (
            <UserList
              userList={filterUsersByRole(users, RoleName.EDITOR)}
              roleToRemove={RoleName.EDITOR}
              refetchUsers={fetchInstitutionUsers}
              tableCaption={t('profile:roles.editors')}
            />
          )}
          <StyledNewButton
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
            data-testid="button-add-editor"
            onClick={() => setRoleToAdd(RoleName.EDITOR)}>
            {t('users.add_editor')}
          </StyledNewButton>
        </StyledContainer>

        <StyledContainer data-testid={dataTestId.myInstitutionUsersPage.usersCreators}>
          <Typography variant="h3" component="h2">
            {t('profile:roles.creator')}
          </Typography>
          <Divider />
          <Typography>{t('users.creator_info')}</Typography>
          <FormControlLabel
            control={<Checkbox disabled checked={autoAssignCreators} data-testid="checkbox-assign-creators" />}
            onChange={handleCheckAutoAssignCreators}
            label={t('users.auto_assign_creators')}
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
      </Card>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyInstitutionUsersPage;
