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
  const user = useSelector((store: RootStore) => store.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');

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
      const updatedAuthorityWithFeide = await updateFeideForAuthority(user.id, selectedSystemControlNumber);
      if (updatedAuthorityWithFeide) {
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
        {matchingAuthorities.length > 0 ? (
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
          <NewAuthorityCard />
        )}
      </StyledAuthorityContainer>
    </>
  );
};
