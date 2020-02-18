import React from 'react';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledNotFoundWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const NotFound: React.FC = () => {
  const { t } = useTranslation('feedback');

  return (
    <StyledNotFoundWrapper data-testid="404">
      <FormCardHeading>{t('error.404_page')}</FormCardHeading>
    </StyledNotFoundWrapper>
  );
};

export default NotFound;
