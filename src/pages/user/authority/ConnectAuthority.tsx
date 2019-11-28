import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthorities } from '../../../api/external/authorityRegisterApi';
import { RootStore } from '../../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

export const ConnectAuthority: React.FC = () => {
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>([]);
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

  return (
    <StyledAuthorityContainer>
      {t('authority.search_summary', { results: matchingAuthorities.length, searchTerm: searchTerm })}
      {matchingAuthorities.map(authority => (
        <AuthorityCard key={authority.systemControlNumber} authority={authority} />
      ))}
    </StyledAuthorityContainer>
  );
};
