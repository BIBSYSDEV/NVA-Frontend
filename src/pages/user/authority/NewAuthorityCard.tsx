import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Radio, Typography } from '@material-ui/core';
import { createAuthority } from '../../../api/authorityApi';
import { ButtonWithProgress } from '../../../components/ButtonWithProgress';
import { StyledTypographyPreWrapped } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { NotificationVariant } from '../../../types/notification.types';
import { User } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

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

const StyledLabel = styled(Typography)`
  display: inline-grid;
`;

const StyledDescription = styled(StyledTypographyPreWrapped)`
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

export const NewAuthorityCard = ({ onClickCancel, user }: NewAuthorityCardProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('profile');
  const hasMatchingAuthorities = user.possibleAuthorities.length > 0;
  const { familyName, givenName, id, name } = user;

  const handleCreateAuthority = async () => {
    setIsLoading(true);
    const createAuthorityResponse = await createAuthority(givenName, familyName, id, user.cristinId);
    if (isErrorStatus(createAuthorityResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_authority'), NotificationVariant.Error));
      onClickCancel();
    } else if (isSuccessStatus(createAuthorityResponse.status)) {
      dispatch(setAuthorityData(createAuthorityResponse.data));
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
        color="secondary"
        variant="contained"
        size="large"
        isLoading={isLoading}
        onClick={handleCreateAuthority}>
        {t('authority.create_authority')}
      </StyledSaveButton>
      {hasMatchingAuthorities && (
        <StyledCancelButton
          data-testid="cancel-create-author-button"
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
