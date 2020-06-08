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

const Description: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <StyledInformationWrapper data-testid="description" aria-label={t('description.heading')}>
      <Card>
        <StyledHeading>{t('description.heading')}</StyledHeading>
        <StyledNormalTextPreWrapped>{t('description.description')}</StyledNormalTextPreWrapped>
      </Card>
    </StyledInformationWrapper>
  );
};

export default Description;
