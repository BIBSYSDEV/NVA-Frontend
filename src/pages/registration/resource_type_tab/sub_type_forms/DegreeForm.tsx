import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import lightTheme from '../../../../themes/lightTheme';
import DoiField from '../components/DoiField';
import PublisherField from '../components/PublisherField';
import SeriesField from '../components/SeriesField';

const DegreeForm = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <Typography variant="h5">{t('references.series')}</Typography>
        <Typography>{t('references.series_info')}</Typography>
        <SeriesField />
      </BackgroundDiv>
    </>
  );
};

export default DegreeForm;
