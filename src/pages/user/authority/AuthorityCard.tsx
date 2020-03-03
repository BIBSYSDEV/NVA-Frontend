import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Truncate from 'react-truncate';
import styled from 'styled-components';

import { Radio } from '@material-ui/core';

import { getAlmaPublication } from '../../../api/almaApi';
import { Authority } from '../../../types/authority.types';
import { AlmaPublication } from '../../../types/publication.types';
import NormalText from '../../../components/NormalText';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;
  height: 5.5rem;
`;

const StyledPublicationContent = styled.div`
  align-self: center;
`;

const StyledPublicationInfo = styled.div`
  display: block;
  font-weight: bold;
`;

const StyledAuthority = styled.div`
  align-self: center;
`;

interface AuthorityCardProps {
  authority: Authority;
  isSelected: boolean;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority, isSelected }) => {
  const [publication, setPublication] = useState<AlmaPublication>();
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');

  useEffect(() => {
    const fetchAuthorities = async () => {
      const retrievedPublication = await getAlmaPublication(authority.systemControlNumber, authority.name);
      if (!retrievedPublication.error) {
        setPublication(retrievedPublication);
      }
    };

    fetchAuthorities();
  }, [dispatch, authority.systemControlNumber, authority.name]);

  return (
    <StyledBoxContent>
      <StyledAuthority>
        <Radio color="primary" checked={isSelected} />
        {authority?.name}
      </StyledAuthority>
      <StyledPublicationContent>
        {publication?.title ? (
          <>
            <StyledPublicationInfo>{t('authority.last_publication')}</StyledPublicationInfo>
            <Truncate lines={2} ellipsis={<span>...</span>}>
              <NormalText>{publication.title}</NormalText>
            </Truncate>
          </>
        ) : (
          <i>{t('authority.no_publications_found')}</i>
        )}
      </StyledPublicationContent>
    </StyledBoxContent>
  );
};

export default AuthorityCard;
