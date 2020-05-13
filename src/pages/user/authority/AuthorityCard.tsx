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
import useFetchUnitHierarchy from '../../../utils/hooks/useFetchUnitHierarchy';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';

const StyledBoxContent = styled.div<{ isConnected: boolean }>`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-gap: 1rem;
  padding: 1rem;
  height: 5.5rem;
  ${({ isConnected, theme }) =>
    isConnected ? `background-color: ${theme.palette.success.light}` : `background-color: ${theme.palette.box.main}`};
`;

const StyledContent = styled.div`
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
      <StyledContent>
        {!isConnected && <Radio color="primary" checked={isSelected} />}
        <NormalText>{authority?.name}</NormalText>
      </StyledContent>
      <StyledContent>
        {isLoadingPublication ? (
          <CircularProgress />
        ) : publication?.title ? (
          <NormalText>
            <Truncate lines={3}>{publication.title}</Truncate>
          </NormalText>
        ) : (
          <NormalText>
            <i>{t('authority.no_publications_found')}</i>
          </NormalText>
        )}
      </StyledContent>
      <StyledContent>
        {authority.orgunitids.length > 0 ? (
          <AuthorityAffiliation unitId={authority.orgunitids[0]} />
        ) : (
          <NormalText>
            <i>{t('authority.no_affiliations_found')}</i>
          </NormalText>
        )}
      </StyledContent>
    </StyledBoxContent>
  );
};

interface AuthorityAffiliationProps {
  unitId: string;
}

const AuthorityAffiliation: React.FC<AuthorityAffiliationProps> = ({ unitId }) => {
  const [unit, isLoadingUnit] = useFetchUnitHierarchy(unitId);

  return isLoadingUnit ? <CircularProgress /> : unit ? <AffiliationHierarchy unit={unit} boldTopLevel={false} /> : null;
};

export default AuthorityCard;
