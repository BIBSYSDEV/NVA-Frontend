import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { updateFeideForAuthority, updateInstitutionForAuthority } from '../../../api/authorityApi';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';
import NewAuthorityCard from './NewAuthorityCard';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

const StyledClickableDiv = styled.div`
  cursor: pointer;
`;

const StyledSubHeading = styled.div`
  text-align: right;
  font-weight: bold;
`;

export const ConnectAuthority: FC = () => {
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>([]);
  const [selectedSystemControlNumber, setSelectedSystemControlNumber] = useState('');
  const [openNewAuthorityCard, setOpenNewAuthorityCard] = useState(false);
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const hasMatchingAuthorities = matchingAuthorities.length > 0;

  useEffect(() => {
    if (user.possibleAuthorities.length > 0) {
      setMatchingAuthorities(user.possibleAuthorities);
    }
  }, [user.possibleAuthorities]);

  const updateAuthorityForUser = async () => {
    const selectedAuthority = matchingAuthorities.find(
      auth => auth.systemControlNumber === selectedSystemControlNumber
    );

    if (selectedAuthority) {
      const updatedAuthorityWithFeide: Authority = await updateFeideForAuthority(user.id, selectedSystemControlNumber);
      if (updatedAuthorityWithFeide?.orgunitids.includes(user.organizationId)) {
        dispatch(setAuthorityData(updatedAuthorityWithFeide));
      } else {
        const updatedAuthorityWithOrganizationId = await updateInstitutionForAuthority(
          user.organizationId,
          selectedSystemControlNumber
        );
        dispatch(setAuthorityData(updatedAuthorityWithOrganizationId));
      }
    }
  };

  return (
    <>
      <StyledAuthorityContainer>
        {hasMatchingAuthorities && !openNewAuthorityCard && (
          <>
            <StyledSubHeading>
              {t('authority.search_summary', { results: matchingAuthorities?.length ?? 0, searchTerm: user.name })}
            </StyledSubHeading>
            {matchingAuthorities.map(authority => (
              <StyledClickableDiv
                data-testid="author-radio-button"
                key={authority.systemControlNumber}
                onClick={() => setSelectedSystemControlNumber(authority.systemControlNumber)}>
                <AuthorityCard
                  authority={authority}
                  isSelected={selectedSystemControlNumber === authority.systemControlNumber}
                />
              </StyledClickableDiv>
            ))}
            <StyledButtonContainer>
              <Button color="primary" variant="text" onClick={() => setOpenNewAuthorityCard(true)}>
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
        )}
        {(!hasMatchingAuthorities || openNewAuthorityCard) && (
          <NewAuthorityCard
            description={
              hasMatchingAuthorities
                ? t('authority.description_create_own_authority')
                : t('authority.description_no_authority_found')
            }
          />
        )}
      </StyledAuthorityContainer>
    </>
  );
};
