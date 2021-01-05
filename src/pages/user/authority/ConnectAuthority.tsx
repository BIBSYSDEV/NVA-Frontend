import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions } from '@material-ui/core';

import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../../api/authorityApi';
import { setAuthorityData } from '../../../redux/actions/userActions';
import NewAuthorityCard from './NewAuthorityCard';
import AuthorityList from './AuthorityList';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { NotificationVariant } from '../../../types/notification.types';
import { setNotification } from '../../../redux/actions/notificationActions';
import { User } from '../../../types/user.types';

const StyledAuthorityContainer = styled.div`
  min-width: 20rem;
  > * {
    margin-top: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    min-width: auto;
  }
`;

interface ConnectAuthorityProps {
  user: User;
  handleCloseModal: () => void;
}

export const ConnectAuthority: FC<ConnectAuthorityProps> = ({ user, handleCloseModal }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const [selectedArpId, setSelectedArpId] = useState('');
  const [openNewAuthorityCard, setOpenNewAuthorityCard] = useState(false);
  const [isUpdatingAuthority, setIsUpdatingAuthority] = useState(false);

  const toggleOpenNewAuthorityCard = () => {
    setOpenNewAuthorityCard(!openNewAuthorityCard);
  };

  const updateAuthorityForUser = async () => {
    const selectedAuthority = user.possibleAuthorities.find((authority) => authority.id === selectedArpId);

    if (selectedAuthority) {
      setIsUpdatingAuthority(true);
      const updatedAuthorityWithFeide = await addQualifierIdForAuthority(
        selectedArpId,
        AuthorityQualifiers.FEIDE_ID,
        user.id
      );
      if (updatedAuthorityWithFeide.error) {
        dispatch(setNotification(updatedAuthorityWithFeide.error, NotificationVariant.Error));
        setIsUpdatingAuthority(false);
      } else if (user.cristinId && !updatedAuthorityWithFeide.orgunitids.includes(user.cristinId)) {
        const updatedAuthorityWithCristinId = await addQualifierIdForAuthority(
          selectedArpId,
          AuthorityQualifiers.ORGUNIT_ID,
          user.cristinId
        );
        dispatch(setAuthorityData(updatedAuthorityWithCristinId));
      } else {
        dispatch(setAuthorityData(updatedAuthorityWithFeide));
      }
    }
  };

  return (
    <>
      <StyledAuthorityContainer>
        {user.possibleAuthorities.length > 0 && !openNewAuthorityCard ? (
          <>
            <AuthorityList
              authorities={user.possibleAuthorities}
              selectedArpId={selectedArpId}
              onSelectAuthority={(authority) => setSelectedArpId(authority.id)}
              searchTerm={user.name}
            />
            <StyledRightAlignedWrapper>
              <Button
                color="primary"
                variant="text"
                data-testid="button-create-authority"
                onClick={toggleOpenNewAuthorityCard}>
                {t('authority.create_own_authority')}
              </Button>
            </StyledRightAlignedWrapper>

            <DialogActions>
              <Button variant="text" onClick={handleCloseModal}>
                {t('common:cancel')}
              </Button>
              <ButtonWithProgress
                data-testid="connect-author-button"
                color="primary"
                variant="contained"
                size="large"
                onClick={updateAuthorityForUser}
                disabled={!selectedArpId || isUpdatingAuthority}
                isLoading={isUpdatingAuthority}>
                {t('authority.connect_authority')}
              </ButtonWithProgress>
            </DialogActions>
          </>
        ) : (
          <NewAuthorityCard user={user} onClickCancel={toggleOpenNewAuthorityCard} />
        )}
      </StyledAuthorityContainer>
    </>
  );
};
