import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledHeader = styled.div`
  width: 85vw;
  margin-bottom: 1rem;
`;

const StyledHeaderTitle = styled(Typography)`
  border-bottom: 3px solid;
  padding-bottom: 0.5rem;
`;

interface PageHeaderProps {
  backPath?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ backPath, children }) => {
  const { t } = useTranslation('common');
  const history = useHistory();

  const onBackClick = () => {
    if (backPath) {
      history.push(backPath);
    } else {
      history.goBack();
    }
  };

  return (
    <StyledHeader>
      <Button startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
        {t('back')}
      </Button>
      <StyledHeaderTitle variant="h1">{children}</StyledHeaderTitle>
    </StyledHeader>
  );
};
