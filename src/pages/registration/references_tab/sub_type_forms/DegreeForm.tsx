import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import theme from '../../../../themes/mainTheme';
import DoiField from '../components/DoiField';
import PublisherField from '../components/PublisherField';
import SeriesField from '../components/SeriesField';

const DegreeForm = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <DoiField />
        <PublisherField />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={theme.palette.section.dark}>
        <Typography color="primary" variant="h5">
          {t('references.series')}
        </Typography>
        <Typography color="primary">{t('references.series_info')}</Typography>
        <SeriesField />
      </BackgroundDiv>
    </>
  );
};

export default DegreeForm;
