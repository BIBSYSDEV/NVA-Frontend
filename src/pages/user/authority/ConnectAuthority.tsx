import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthorities, updateAuthority } from '../../../api/external/authorityRegisterApi';
import { RootStore } from '../../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';
import { Button } from '@material-ui/core';

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
  const [selectedAuthorityScn, SetSelectedAuthorityScn] = useState<string>('');
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
    const authority = matchingAuthorities.find(auth => auth.systemControlNumber === selectedAuthorityScn);

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
          onClick={() => SetSelectedAuthorityScn(authority.systemControlNumber)}>
          <AuthorityCard authority={authority} isSelected={selectedAuthorityScn === authority.systemControlNumber} />
        </StyledClickableDiv>
      ))}

      {matchingAuthorities.length ? (
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={setFeideIdForSelectedAuthority}
          disabled={!selectedAuthorityScn.length}>
          {t('authority.connect_authority')}
        </Button>
      ) : null}
    </StyledAuthorityContainer>
  );
};
