import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyledCenteredContent } from '../../components/styled/Wrappers';

const NotFound = () => {
  const { t } = useTranslation('feedback');

  return (
    <StyledCenteredContent data-testid="404">
      <Typography variant="h3" component="h1">
        {t('error.404_page')}
      </Typography>
    </StyledCenteredContent>
  );
};

export default NotFound;
