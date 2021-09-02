import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { TotalPagesField } from '../components/TotalPagesField';
import { PublisherField } from '../components/PublisherField';

interface DegreeFormProps {
  subType: DegreeType;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />
        <TotalPagesField />
      </BackgroundDiv>

      {subType === DegreeType.Phd && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <Typography variant="h5">{t('resource_type.series')}</Typography>
          <Typography>{t('resource_type.series_info')}</Typography>
          <SeriesFields />
        </BackgroundDiv>
      )}
    </>
  );
};
