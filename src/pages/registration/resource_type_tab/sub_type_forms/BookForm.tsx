import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, Typography } from '@mui/material';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SeriesFields } from '../components/SeriesFields';
import { NviFields } from '../components/nvi_fields/NviFields';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { BookMonographContentType } from '../../../../types/publication_types/content.types';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const BookForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <DoiField />
        <PublisherField />

        <ThemeProvider theme={lightTheme}>
          <NpiDisciplineField />
        </ThemeProvider>

        <IsbnAndPages />
      </BackgroundDiv>

      {instanceType === BookType.Monograph && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
          <NviFields contentTypes={Object.values(BookMonographContentType)} />
        </BackgroundDiv>
      )}

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
        <Typography variant="h5">{t('resource_type.series')}</Typography>
        <Typography>{t('resource_type.series_info')}</Typography>
        <SeriesFields />
      </BackgroundDiv>

      {instanceType === BookType.Monograph && <NviValidation registration={values} />}
    </>
  );
};
