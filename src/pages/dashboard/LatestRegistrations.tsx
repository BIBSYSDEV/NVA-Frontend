import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import Search from '../search/Search';

const StyledListContainer = styled.div`
  margin-top: 2rem;
`;

const LatestRegistrations: FC = () => {
  const { t } = useTranslation('registration');

  return (
    <StyledListContainer data-testid="latest-registrations">
      <Heading>{t('registration.latest_registrations')}</Heading>
      <Search noHitsText={t('registration.no_published_registrations_yet')} />
    </StyledListContainer>
  );
};

export default LatestRegistrations;
