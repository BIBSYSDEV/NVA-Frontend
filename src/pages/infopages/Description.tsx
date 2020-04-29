import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';

import Card from '../../components/Card';

const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

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
    <StyledInformationWrapper data-testid="description" aria-label={t('description.description_heading')}>
      <Card>
        <StyledHeading>{t('description.description_heading')}</StyledHeading>
        <StyledDescription>{t('description.description_description')}</StyledDescription>
      </Card>
    </StyledInformationWrapper>
  );
};

export default Description;
