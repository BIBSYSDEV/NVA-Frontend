import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Truncate from 'react-truncate';
import styled from 'styled-components';
import { Radio, CircularProgress } from '@material-ui/core';

import { getAlmaPublication } from '../../../api/almaApi';
import { Authority } from '../../../types/authority.types';
import { AlmaPublication } from '../../../types/publication.types';
import NormalText from '../../../components/NormalText';

const StyledBoxContent = styled.div<{ isConnected: boolean }>`
  display: grid;
  grid-template-columns: 2fr 2fr;
  padding: 1rem;
  height: 5.5rem;
  ${({ isConnected, theme }) =>
    isConnected ? `background-color: ${theme.palette.success.light}` : `background-color: ${theme.palette.box.main}`};
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
  isConnected?: boolean;
  isSelected?: boolean;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority, isConnected = false, isSelected }) => {
  const [publication, setPublication] = useState<AlmaPublication | null>(null);
  const [isLoadingPublication, setIsLoadingPublication] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');

  useEffect(() => {
    const fetchLastPublication = async () => {
      const retrievedPublication = await getAlmaPublication(authority.systemControlNumber, authority.name);
      if (!retrievedPublication.error) {
        setPublication(retrievedPublication);
      }
      setIsLoadingPublication(false);
    };

    fetchLastPublication();
  }, [dispatch, authority.systemControlNumber, authority.name]);

  return (
    <StyledBoxContent isConnected={isConnected}>
      <StyledAuthority>
        {!isConnected && <Radio color="primary" checked={isSelected} />}
        {authority?.name}
      </StyledAuthority>
      <StyledPublicationContent>
        <StyledPublicationInfo>{t('authority.last_publication')}</StyledPublicationInfo>
        {isLoadingPublication ? (
          <CircularProgress />
        ) : publication?.title ? (
          <Truncate lines={2} ellipsis={<span>...</span>}>
            <NormalText>{publication.title}</NormalText>
          </Truncate>
        ) : (
          <i>{t('authority.no_publications_found')}</i>
        )}
      </StyledPublicationContent>
    </StyledBoxContent>
  );
};

export default AuthorityCard;
