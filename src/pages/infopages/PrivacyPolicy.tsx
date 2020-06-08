import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';

import Card from '../../components/Card';
import { StyledInformationWrapper, StyledNormalTextPreWrapped } from '../../components/styled/Wrappers';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const PrivacyPolicy: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <StyledInformationWrapper data-testid="privacy-policy" aria-label={t('privacy_policy.heading')}>
      <Card>
        <StyledHeading>{t('privacy_policy.heading')}</StyledHeading>
        <StyledNormalTextPreWrapped>{t('privacy_policy.description')}</StyledNormalTextPreWrapped>
      </Card>
    </StyledInformationWrapper>
  );
};

export default PrivacyPolicy;
