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

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

export const ConnectAuthority: FC = () => {
  const [selectedSystemControlNumber, setSelectedSystemControlNumber] = useState('');
  const [openNewAuthorityCard, setOpenNewAuthorityCard] = useState(false);
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const matchingAuthorities = user.possibleAuthorities ?? [];
  const hasMatchingAuthorities = matchingAuthorities.length > 0;

  const toggleOpenNewAuthorityCard = () => {
    setOpenNewAuthorityCard(!openNewAuthorityCard);
  };

  const updateAuthorityForUser = async () => {
    const selectedAuthority = matchingAuthorities.find(
      (auth) => auth.systemControlNumber === selectedSystemControlNumber
    );

    if (selectedAuthority) {
      const updatedAuthorityWithFeide: Authority = await addQualifierIdForAuthority(
        selectedSystemControlNumber,
        AuthorityQualifiers.FEIDE_ID,
        user.id
      );
      if (updatedAuthorityWithFeide?.orgunitids.includes(user.organizationId)) {
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
        {hasMatchingAuthorities && !openNewAuthorityCard ? (
          <>
            <AuthorityList
              authorities={matchingAuthorities}
              selectedSystemControlNumber={selectedSystemControlNumber}
              onSelectAuthority={(authority: Authority) =>
                setSelectedSystemControlNumber(authority.systemControlNumber)
              }
              searchTerm={user.name}
            />
            <StyledButtonContainer>
              <Button color="primary" variant="text" onClick={toggleOpenNewAuthorityCard}>
                {t('authority.create_own_authority')}
              </Button>
            </StyledButtonContainer>
            <Button
              data-testid="connect-author-button"
              color="primary"
              variant="contained"
              size="large"
              onClick={updateAuthorityForUser}
              disabled={!selectedSystemControlNumber}>
              {t('authority.connect_authority')}
            </Button>
          </>
        ) : (
          <NewAuthorityCard onClickCancel={toggleOpenNewAuthorityCard} />
        )}
      </StyledAuthorityContainer>
    </>
  );
};
