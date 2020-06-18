import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../../api/authorityApi';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import NewAuthorityCard from './NewAuthorityCard';
import AuthorityList from './AuthorityList';
import { StyledRightAlignedButtonWrapper } from '../../../components/styled/Wrappers';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { NotificationVariant } from '../../../types/notification.types';
import { setNotification } from '../../../redux/actions/notificationActions';

const StyledAuthorityContainer = styled.div`
  min-width: 20rem;
  > * {
    margin-top: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    min-width: auto;
  }
`;

export const ConnectAuthority: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const user = useSelector((store: RootStore) => store.user);
  const [selectedSystemControlNumber, setSelectedSystemControlNumber] = useState('');
  const [openNewAuthorityCard, setOpenNewAuthorityCard] = useState(false);
  const [isUpdatingAuthority, setIsUpdatingAuthority] = useState(false);

  const toggleOpenNewAuthorityCard = () => {
    setOpenNewAuthorityCard(!openNewAuthorityCard);
  };

  const updateAuthorityForUser = async () => {
    const selectedAuthority = user.possibleAuthorities.find(
      (authority) => authority.systemControlNumber === selectedSystemControlNumber
    );

    if (selectedAuthority) {
      setIsUpdatingAuthority(true);
      const updatedAuthorityWithFeide = await addQualifierIdForAuthority(
        selectedSystemControlNumber,
        AuthorityQualifiers.FEIDE_ID,
        user.id
      );
      if (updatedAuthorityWithFeide.error) {
        dispatch(setNotification(updatedAuthorityWithFeide.error, NotificationVariant.Error));
        setIsUpdatingAuthority(false);
      } else if (
        updatedAuthorityWithFeide?.orgunitids &&
        updatedAuthorityWithFeide.orgunitids.includes(user.organizationId)
      ) {
        dispatch(setAuthorityData(updatedAuthorityWithFeide));
      } else {
        const updatedAuthorityWithOrganizationId = await addQualifierIdForAuthority(
          selectedSystemControlNumber,
          AuthorityQualifiers.ORGUNIT_ID,
          user.organizationId
        );
        dispatch(setAuthorityData(updatedAuthorityWithOrganizationId));
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
              selectedSystemControlNumber={selectedSystemControlNumber}
              onSelectAuthority={(authority: Authority) =>
                setSelectedSystemControlNumber(authority.systemControlNumber)
              }
              searchTerm={user.name}
            />
            <StyledRightAlignedButtonWrapper>
              <Button color="primary" variant="text" onClick={toggleOpenNewAuthorityCard}>
                {t('authority.create_own_authority')}
              </Button>
            </StyledRightAlignedButtonWrapper>
            <ButtonWithProgress
              data-testid="connect-author-button"
              color="primary"
              variant="contained"
              size="large"
              onClick={updateAuthorityForUser}
              disabled={!selectedSystemControlNumber || isUpdatingAuthority}
              isLoading={isUpdatingAuthority}>
              {t('authority.connect_authority')}
            </ButtonWithProgress>
          </>
        ) : (
          <NewAuthorityCard onClickCancel={toggleOpenNewAuthorityCard} />
        )}
      </StyledAuthorityContainer>
    </>
  );
};
