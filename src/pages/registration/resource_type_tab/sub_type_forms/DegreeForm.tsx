import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { DegreeType } from '../../../../types/publicationFieldNames';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { InputContainerBox } from '../../../../components/styled/Wrappers';

interface DegreeFormProps {
  subType: DegreeType;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <InputContainerBox>
          <DoiField />
          <PublisherField />
          <IsbnAndPages />
        </InputContainerBox>
      </BackgroundDiv>

      {subType === DegreeType.Phd && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <Typography variant="h5">{t('resource_type.series')}</Typography>
          <Typography paragraph>{t('resource_type.series_info')}</Typography>
          <SeriesFields />
        </BackgroundDiv>
      )}
    </>
  );
};
