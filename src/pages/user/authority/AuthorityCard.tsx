import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Truncate from 'react-truncate';
import styled from 'styled-components';
import { Radio, Typography } from '@material-ui/core';
import { Authority } from '../../../types/authority.types';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';
import Card from '../../../components/Card';
import useFetchLastRegistrationFromAlma from '../../../utils/hooks/useFetchLastRegistration';
import { Skeleton } from '@material-ui/lab';

const StyledBoxContent = styled(({ isConnected, ...rest }) => <Card {...rest} />)`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: 1.5rem;
  padding: 0.5rem;
  ${({ isConnected, theme }) =>
    isConnected ? `background-color: ${theme.palette.success.light}` : `background-color: ${theme.palette.box.main}`};
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
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
  const { t } = useTranslation('profile');
  const [almaPublication, isLoadingAlmaPublication] = useFetchLastRegistrationFromAlma(
    authority.systemControlNumber,
    authority.name
  );

  return (
    <StyledBoxContent isConnected={isConnected}>
      <StyledNameCell>
        {!isConnected && <Radio color="primary" checked={isSelected} />}
        <StyledCenteredContent>
          <Typography>{authority?.name}</Typography>
        </StyledCenteredContent>
      </StyledNameCell>
      <StyledCenteredContent>
        {isLoadingAlmaPublication ? (
          <Skeleton width="70%" />
        ) : almaPublication?.title ? (
          <Typography>
            <Truncate lines={3}>{almaPublication.title}</Truncate>
          </Typography>
        ) : (
          <Typography>
            <i>{t('authority.no_registrations_found')}</i>
          </Typography>
        )}
      </StyledCenteredContent>
      <StyledCenteredContent>
        {authority.orgunitids.length > 0 ? (
          <>
            <AffiliationHierarchy unitUri={authority.orgunitids[0]} boldTopLevel={false} />
            {authority.orgunitids.length > 1 && (
              <i>{t('authority.other_affiliations', { count: authority.orgunitids.length - 1 })}</i>
            )}
          </>
        ) : (
          <Typography>
            <i>{t('authority.no_affiliations_found')}</i>
          </Typography>
        )}
      </StyledCenteredContent>
    </StyledBoxContent>
  );
};

export default AuthorityCard;
