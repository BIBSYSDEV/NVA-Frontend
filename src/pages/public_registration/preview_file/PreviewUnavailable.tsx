import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const PreviewUnavailable = () => {
  const { t } = useTranslation('registration');
  return <Typography variant="body2">{t('public_page.preview_unavailable')}</Typography>;
};

export default PreviewUnavailable;
