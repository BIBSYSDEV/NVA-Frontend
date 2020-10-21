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
  const [publications, isLoadingPublications] = useFetchLatestRegistrations();

  return (
    <StyledListContainer data-testid="latest-publications">
      <Heading>{t('registration.latest_registrations')}</Heading>
      <Divider />
      {isLoadingPublications ? (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      ) : publications.length > 0 ? (
        <>
          <List>
            {publications.map((publication) => (
              <RegistrationListItem
                key={publication.identifier}
                primaryComponent={
                  <MuiLink component={Link} to={`/registration/${publication.identifier}/public`}>
                    {publication.mainTitle}
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
