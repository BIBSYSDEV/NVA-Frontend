import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { getAuthorities, updateAuthority } from '../../../api/external/authorityRegisterApi';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

const StyledClickableDiv = styled.div`
  cursor: pointer;
`;

export const ConnectAuthority: React.FC = () => {
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>([]);
  const [selectedSystemControlNumber, setSelectedSystemControlNumber] = useState('');
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const searchTerm = user.name;

  useEffect(() => {
    const fetchAuthorities = async () => {
      const retrievedAuthorities = await getAuthorities(searchTerm, dispatch);
      setMatchingAuthorities(retrievedAuthorities);
    };

    if (searchTerm) {
      fetchAuthorities();
    }
  }, [dispatch, searchTerm]);

  const setFeideIdForSelectedAuthority = async () => {
    const authority = matchingAuthorities.find(auth => auth.systemControlNumber === selectedSystemControlNumber);

    if (authority) {
      // Ensure we keep all existing data when adding Feide ID
      const oldFeideIds = authority.identifiersMap.feide;
      const newFeideIds = oldFeideIds ? [...oldFeideIds, user.id] : [user.id];
      authority.identifiersMap = {
        ...authority.identifiersMap,
        feide: newFeideIds,
      };

      await updateAuthority(authority, dispatch);
    }
  };

  return (
    <StyledAuthorityContainer>
      {t('authority.search_summary', { results: matchingAuthorities.length, searchTerm: searchTerm })}
      {matchingAuthorities.map(authority => (
        <StyledClickableDiv
          key={authority.systemControlNumber}
          onClick={() => setSelectedSystemControlNumber(authority.systemControlNumber)}>
          <AuthorityCard
            authority={authority}
            isSelected={selectedSystemControlNumber === authority.systemControlNumber}
          />
        </StyledClickableDiv>
      ))}

      {matchingAuthorities.length && (
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={setFeideIdForSelectedAuthority}
          disabled={!selectedSystemControlNumber}>
          {t('authority.connect_authority')}
        </Button>
      )}
    </StyledAuthorityContainer>
  );
};
