import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledRequiredDescription = styled.div`
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  display: flex;
`;

const StyledTypography = styled(Typography)`
  font-style: italic;
`;

const StyledAsterisk = styled(Typography)`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.error.main};
  margin-right: 0.5rem;
`;

export const RequiredDescription = () => {
  const { t } = useTranslation('common');

  return (
    <StyledRequiredDescription>
      <StyledAsterisk>*</StyledAsterisk>
      <StyledTypography>{t('required_description')}</StyledTypography>
    </StyledRequiredDescription>
  );
};
