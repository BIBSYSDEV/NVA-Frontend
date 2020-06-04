import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';

import Card from '../../components/Card';
import { InformationWrapper } from '../../components/styled/wrappers';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const StyledDescription = styled(NormalText)`
  white-space: pre-wrap;
`;

const PrivacyPolicy: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <InformationWrapper data-testid="privacy-policy" aria-label={t('privacy_policy.heading')}>
      <Card>
        <StyledHeading>{t('privacy_policy.heading')}</StyledHeading>
        <StyledDescription>{t('privacy_policy.description')}</StyledDescription>
      </Card>
    </InformationWrapper>
  );
};

export default PrivacyPolicy;
