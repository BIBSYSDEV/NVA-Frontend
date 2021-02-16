import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Heading from '../../components/Heading';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';

const StyledNotFoundWrapper = styled(StyledPageWrapperWithMaxWidth)`
  text-align: center;
  padding-top: 4rem;
`;

const NotFound: React.FC = () => {
  const { t } = useTranslation('feedback');

  return (
    <StyledNotFoundWrapper data-testid="404">
      <Heading>{t('error.404_page')}</Heading>
    </StyledNotFoundWrapper>
  );
};

export default NotFound;
