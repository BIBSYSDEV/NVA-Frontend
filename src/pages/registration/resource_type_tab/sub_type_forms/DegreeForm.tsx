import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import lightTheme from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import PublisherField from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { TotalPagesField } from '../components/TotalPagesField';

interface DegreeFormProps {
  subType: DegreeType;
}

const DegreeForm = ({ subType }: DegreeFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />
        <TotalPagesField />
      </BackgroundDiv>

      {subType === DegreeType.PHD && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <Typography variant="h5">{t('resource_type.series')}</Typography>
          <Typography>{t('resource_type.series_info')}</Typography>
          <SeriesFields />
        </BackgroundDiv>
      )}
    </>
  );
};

export default DegreeForm;
