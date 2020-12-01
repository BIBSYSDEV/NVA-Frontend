import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import RegistrationSearch from '../search/RegistrationSearch';

const LatestRegistrations: FC = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Typography variant="h2">{t('registration.latest_registrations')}</Typography>
      <RegistrationSearch noHitsText={t('registration.no_published_registrations_yet')} />
    </>
  );
};

export default LatestRegistrations;
