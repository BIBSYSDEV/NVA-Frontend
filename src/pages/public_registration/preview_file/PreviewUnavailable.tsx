import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const PreviewUnavailable = ({ ...props }) => {
  const { t } = useTranslation('registration');

  return (
    <Typography variant="body2" {...props}>
      {t('public_page.preview_unavailable')}
    </Typography>
  );
};
