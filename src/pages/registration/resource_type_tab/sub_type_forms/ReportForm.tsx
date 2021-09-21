import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const ReportForm = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        <IsbnAndPages />
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>
    </>
  );
};
