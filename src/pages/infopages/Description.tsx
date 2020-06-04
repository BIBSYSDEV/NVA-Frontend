import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { InformationWrapper, NormalTextPreWrapped } from '../../components/styled/Wrappers';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const Description: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <InformationWrapper data-testid="description" aria-label={t('description.heading')}>
      <Card>
        <StyledHeading>{t('description.heading')}</StyledHeading>
        <NormalTextPreWrapped>{t('description.description')}</NormalTextPreWrapped>
      </Card>
    </InformationWrapper>
  );
};

export default Description;
