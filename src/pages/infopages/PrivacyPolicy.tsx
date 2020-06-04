import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';

import Card from '../../components/Card';
import { InformationWrapper, NormalTextPreWrapped } from '../../components/styled/Wrappers1';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const PrivacyPolicy: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <InformationWrapper data-testid="privacy-policy" aria-label={t('privacy_policy.heading')}>
      <Card>
        <StyledHeading>{t('privacy_policy.heading')}</StyledHeading>
        <NormalTextPreWrapped>{t('privacy_policy.description')}</NormalTextPreWrapped>
      </Card>
    </InformationWrapper>
  );
};

export default PrivacyPolicy;
