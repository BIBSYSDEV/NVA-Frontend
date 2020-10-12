import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledHeader = styled.div`
  width: 85vw;
  margin-top: 1rem;
`;

const StyledHeaderTite = styled(Typography)`
  border-bottom: 3px solid;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
`;

export const PageHeader: FC = ({ children }) => {
  const { t } = useTranslation('common');
  const history = useHistory();

  const onBackClick = () => {
    history.goBack();
  };

  return (
    <StyledHeader>
      <Button startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
        {t('back')}
      </Button>
      <StyledHeaderTite variant="h1">{children}</StyledHeaderTite>
    </StyledHeader>
  );
};
