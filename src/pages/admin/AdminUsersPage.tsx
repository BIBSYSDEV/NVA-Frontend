import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormControlLabel, Checkbox, Divider, CircularProgress, Button } from '@material-ui/core';

import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { RoleName } from '../../types/user.types';
import Card from '../../components/Card';
import UserList from './UserList';
import NormalText from './../../components/NormalText';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { filterUsersByRole } from '../../utils/role-helpers';
import Modal from '../../components/Modal';
import { AddRoleModalContent } from './AddRoleModalContent';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 2rem;
`;

const StyledNewButton = styled(Button)`
  margin-top: 1rem;
`;

const AdminUsersPage: FC = () => {
  const { t } = useTranslation('admin');
  const user = useSelector((store: RootStore) => store.user);
  const [users, isLoading] = useFetchUsersForInstitution(user.institution);
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);
  const [roleToAdd, setRoleToAdd] = useState<RoleName>();

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  return (
    <Card>
      <StyledHeading>{t('users.user_administration')}</StyledHeading>

      {/* Admins */}
      <StyledContainer>
        <SubHeading>{t('profile:roles.institution_admins')}</SubHeading>
        <Divider />
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : (
          <UserList userList={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)} />
        )}
        <StyledNewButton color="primary" variant="outlined" onClick={() => setRoleToAdd(RoleName.INSTITUTION_ADMIN)}>
          {t('users.add_institution_admin')}
        </StyledNewButton>
      </StyledContainer>

      {/* Curators */}
      <StyledContainer>
        <SubHeading>{t('profile:roles.curators')}</SubHeading>
        <Divider />
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : (
          <UserList userList={filterUsersByRole(users, RoleName.CURATOR)} />
        )}
        <StyledNewButton color="primary" variant="outlined" onClick={() => setRoleToAdd(RoleName.CURATOR)}>
          {t('users.add_curator')}
        </StyledNewButton>
      </StyledContainer>

      {/* Editors */}
      <StyledContainer>
        <SubHeading>{t('profile:roles.editors')}</SubHeading>
        <Divider />
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : (
          <UserList userList={filterUsersByRole(users, RoleName.EDITOR)} />
        )}
        <StyledNewButton color="primary" variant="outlined" onClick={() => setRoleToAdd(RoleName.EDITOR)}>
          {t('users.add_editor')}
        </StyledNewButton>
      </StyledContainer>

      <StyledContainer>
        <SubHeading>{t('profile:roles.creator')}</SubHeading>
        <Divider />
        <NormalText>{t('users.creator_info')}</NormalText>
        <FormControlLabel
          control={<Checkbox disabled checked={autoAssignCreators} />}
          onChange={handleCheckAutoAssignCreators}
          label={t('users.auto_assign_creators')}
        />
      </StyledContainer>

      {roleToAdd && (
        <Modal
          open={true}
          onClose={() => setRoleToAdd(undefined)}
          headingText={
            roleToAdd === RoleName.INSTITUTION_ADMIN
              ? t('users.add_institution_admin')
              : roleToAdd === RoleName.CURATOR
              ? t('users.add_curator')
              : t('users.add_editor')
          }>
          <AddRoleModalContent role={roleToAdd} closeModal={() => setRoleToAdd(undefined)} />
        </Modal>
      )}
    </Card>
  );
};

export default AdminUsersPage;
