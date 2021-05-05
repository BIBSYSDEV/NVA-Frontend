import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Checkbox, Divider, FormControlLabel, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Card from '../../components/Card';
import ListSkeleton from '../../components/ListSkeleton';
import Modal from '../../components/Modal';
import NormalText from '../../components/NormalText';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { RoleName } from '../../types/user.types';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { filterUsersByRole } from '../../utils/role-helpers';
import { AddRoleModalContent } from './AddRoleModalContent';
import UserList from './UserList';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

const MyInstitutionUsersPage = () => {
  const { t } = useTranslation('admin');
  const user = useSelector((store: RootStore) => store.user);
  const [users, isLoading, fetchInstitutionUsers] = useFetchUsersForInstitution(user?.customerId ?? '');
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);
  const [roleToAdd, setRoleToAdd] = useState<RoleName>();

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  const roleToAddTitle =
    roleToAdd === RoleName.INSTITUTION_ADMIN
      ? t('users.add_institution_admin')
      : roleToAdd === RoleName.CURATOR
      ? t('users.add_curator')
      : t('users.add_editor');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('users.user_administration')}</PageHeader>
      <Card>
        {/* Admins */}
        <StyledContainer>
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
        <StyledContainer>
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
        <StyledContainer>
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

        <StyledContainer>
          <Typography variant="h3" component="h2">
            {t('profile:roles.creator')}
          </Typography>
          <Divider />
          <NormalText>{t('users.creator_info')}</NormalText>
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
