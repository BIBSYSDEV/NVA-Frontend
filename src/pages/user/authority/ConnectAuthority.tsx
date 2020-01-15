import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { getAuthorities, updateAuthority } from '../../../api/authorityApi';
import { setOrcid } from '../../../redux/actions/orcidActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
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

const StyledSubHeading = styled.div`
  text-align: right;
  font-weight: bold;
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

  const setOrcIdAndFeideId = async () => {
    const selectedAuthority = matchingAuthorities.find(auth => auth.scn === selectedSystemControlNumber);

    if (selectedAuthority) {
      selectedAuthority.orcId && dispatch(setOrcid(selectedAuthority.orcId));

      const authority: Authority = { ...selectedAuthority, feideId: user.id };
      dispatch(setAuthorityData(authority));
      await updateAuthority(authority, dispatch);
      dispatch(setAuthorityData(authority));
    }
  };

  return (
    <>
      <StyledSubHeading>
        {t('authority.search_summary', { results: matchingAuthorities?.length ?? 0, searchTerm: searchTerm })}
      </StyledSubHeading>

      <StyledAuthorityContainer>
        {matchingAuthorities?.map(authority => (
          <StyledClickableDiv key={authority.scn} onClick={() => setSelectedSystemControlNumber(authority.scn)}>
            <AuthorityCard authority={authority} isSelected={selectedSystemControlNumber === authority.scn} />
          </StyledClickableDiv>
        ))}

        {matchingAuthorities?.length > 0 && (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={setOrcIdAndFeideId}
            disabled={!selectedSystemControlNumber}>
            {t('authority.connect_authority')}
          </Button>
        )}
      </StyledAuthorityContainer>
    </>
  );
};
