import React, { useEffect, useState, FC } from 'react';
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
import Card from '../../../components/Card';

const StyledBoxContent = styled(({ isConnected, ...rest }) => <Card {...rest} />)`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-gap: 1.5rem;
  padding: 0.5rem;
  ${({ isConnected, theme }) =>
    isConnected ? `background-color: ${theme.palette.success.light}` : `background-color: ${theme.palette.box.main}`};
`;

const StyledCenteredContent = styled.div`
  align-self: center;
`;

const StyledNameCell = styled(StyledCenteredContent)`
  display: flex;
`;

interface AuthorityCardProps {
  authority: Authority;
  isConnected?: boolean;
  isSelected?: boolean;
}

const AuthorityCard: FC<AuthorityCardProps> = ({ authority, isConnected = false, isSelected }) => {
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
      <StyledNameCell>
        {!isConnected && <Radio color="primary" checked={isSelected} />}
        <StyledCenteredContent>
          <NormalText>{authority?.name}</NormalText>
        </StyledCenteredContent>
      </StyledNameCell>
      <StyledCenteredContent>
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
      </StyledCenteredContent>
      <StyledCenteredContent>
        {authority.orgunitids.length > 0 ? (
          <>
            <AuthorityAffiliation unitId={authority.orgunitids[0]} />
            {authority.orgunitids.length > 1 && (
              <i>{t('authority.other_affiliations', { count: authority.orgunitids.length - 1 })}</i>
            )}
          </>
        ) : (
          <NormalText>
            <i>{t('authority.no_affiliations_found')}</i>
          </NormalText>
        )}
      </StyledCenteredContent>
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
