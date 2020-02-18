import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';

const StyledNotFoundWrapper = styled.div`
  width: 100%;
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
