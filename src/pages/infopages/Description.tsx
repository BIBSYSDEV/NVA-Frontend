import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';

import Card from '../../components/Card';
import { InformationWrapper } from '../../components/styled/Wrappers';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const StyledDescription = styled(NormalText)`
  white-space: pre-wrap;
`;

const Description: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <InformationWrapper data-testid="description" aria-label={t('description.heading')}>
      <Card>
        <StyledHeading>{t('description.heading')}</StyledHeading>
        <StyledDescription>{t('description.description')}</StyledDescription>
      </Card>
    </InformationWrapper>
  );
};

export default Description;
