import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Radio } from '@material-ui/core';

import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { createAuthority } from '../../../api/authorityApi';
import { NotificationVariant } from '../../../types/notification.types';
import { StyledNormalTextPreWrapped } from '../../../components/styled/Wrappers';
import Label from '../../../components/Label';
import { User } from '../../../types/user.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-areas:
    'authority authority authority'
    'description description description'
    'cancel-button . create-button';
  grid-template-columns: 1fr 3fr 3fr;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'authority' 'description' 'create-button' 'cancel-button';
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const StyledAuthority = styled.div`
  grid-area: authority;
`;

const StyledLabel = styled(Label)`
  display: inline-grid;
`;

const StyledDescription = styled(StyledNormalTextPreWrapped)`
  grid-area: description;
  margin-left: 0.7rem;
`;

const StyledSaveButton = styled(ButtonWithProgress)`
  grid-area: create-button;
  margin-top: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

const StyledCancelButton = styled(Button)`
  grid-area: cancel-button;
  margin-top: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

interface NewAuthorityCardProps {
  user: User;
  onClickCancel: () => void;
}

const NewAuthorityCard: FC<NewAuthorityCardProps> = ({ onClickCancel, user }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('profile');
  const hasMatchingAuthorities = user.possibleAuthorities.length > 0;
  const { familyName, givenName, id, name } = user;

  const handleCreateAuthority = async () => {
    setIsLoading(true);
    const authority = await createAuthority(givenName, familyName, id, user.cristinId);
    if (authority?.error) {
      dispatch(setNotification(authority.error, NotificationVariant.Error));
      onClickCancel();
    } else {
      dispatch(setAuthorityData(authority));
      dispatch(setNotification(t('feedback:success.created_authority')));
    }
    setIsLoading(false);
  };

  return (
    <StyledBoxContent>
      <StyledAuthority>
        <Radio color="primary" checked />
        <StyledLabel>{name}</StyledLabel>
      </StyledAuthority>
      <StyledDescription>
        {hasMatchingAuthorities
          ? t('authority.description_create_own_authority')
          : t('authority.description_no_authority_found')}
      </StyledDescription>
      <StyledSaveButton
        data-testid="create-author-button"
        color="primary"
        variant="contained"
        size="large"
        isLoading={isLoading}
        onClick={handleCreateAuthority}>
        {t('common:create_authority')}
      </StyledSaveButton>
      {hasMatchingAuthorities && (
        <StyledCancelButton
          data-testid="cancel-create-author-button"
          color="secondary"
          variant="contained"
          size="large"
          disabled={isLoading}
          onClick={onClickCancel}>
          {t('common:cancel')}
        </StyledCancelButton>
      )}
    </StyledBoxContent>
  );
};

export default NewAuthorityCard;
