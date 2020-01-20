import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { updateFeideForAuthority } from '../../../api/authorityApi';
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

  useEffect(() => {
    if (user.possibleAuthorities.length > 0) {
      setMatchingAuthorities(user.possibleAuthorities);
    }
  }, [user.possibleAuthorities]);

  const setOrcidAndFeide = async () => {
    const selectedAuthority = matchingAuthorities.find(
      auth => auth.systemControlNumber === selectedSystemControlNumber
    );

    if (selectedAuthority && user.authority) {
      selectedAuthority.orcids.length > 0 && dispatch(setOrcid(selectedAuthority.orcids));

      const updatedAuthority = await updateFeideForAuthority(user.id, user.authority.systemControlNumber, dispatch);
      dispatch(setAuthorityData(updatedAuthority));
    }
  };

  return (
    <>
      <StyledSubHeading>
        {t('authority.search_summary', { results: matchingAuthorities?.length ?? 0, searchTerm: user.name })}
      </StyledSubHeading>

      <StyledAuthorityContainer>
        {matchingAuthorities?.map(authority => (
          <StyledClickableDiv
            key={authority.systemControlNumber}
            onClick={() => setSelectedSystemControlNumber(authority.systemControlNumber)}>
            <AuthorityCard
              authority={authority}
              isSelected={selectedSystemControlNumber === authority.systemControlNumber}
            />
          </StyledClickableDiv>
        ))}

        {matchingAuthorities?.length > 0 && (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={setOrcidAndFeide}
            disabled={!selectedSystemControlNumber}>
            {t('authority.connect_authority')}
          </Button>
        )}
      </StyledAuthorityContainer>
    </>
  );
};
