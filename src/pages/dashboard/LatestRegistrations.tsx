import React, { FC } from 'react';
import styled from 'styled-components';
import { List, CircularProgress, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useFetchLatestRegistrations from '../../utils/hooks/useFetchLatestRegistrations';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import NormalText from '../../components/NormalText';
import RegistrationListItem from './RegistrationListItem';
import Heading from '../../components/Heading';

const StyledListContainer = styled.div`
  margin-top: 2rem;
`;

const StyledNormalText = styled(NormalText)`
  margin-top: 1rem;
`;

const LatestRegistrations: FC = () => {
  const { t } = useTranslation('registration');
  const [registrations, isLoadingRegistrations] = useFetchLatestRegistrations();

  return (
    <StyledListContainer data-testid="latest-registrations">
      <Heading>{t('registration.latest_registrations')}</Heading>
      <Divider />
      {isLoadingRegistrations ? (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      ) : registrations.length > 0 ? (
        <>
          <List>
            {registrations.map((registration) => (
              <RegistrationListItem
                key={registration.identifier}
                primaryComponent={
                  <MuiLink component={Link} to={`/registration/${registration.identifier}/public`}>
                    {registration.mainTitle}
                  </MuiLink>
                }
              />
            ))}
          </List>
          <Divider />
        </>
      ) : (
        <StyledNormalText>{t('registration.no_published_registrations_yet')}</StyledNormalText>
      )}
    </StyledListContainer>
  );
};

export default LatestRegistrations;
