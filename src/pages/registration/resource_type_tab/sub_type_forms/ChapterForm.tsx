import InfoIcon from '@mui/icons-material/Info';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BookType, ChapterType, ReportType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';

const anthologyChapterTypes: string[] = [
  ChapterType.AcademicChapter,
  ChapterType.NonFictionChapter,
  ChapterType.PopularScienceChapter,
  ChapterType.TextbookChapter,
  ChapterType.EncyclopediaChapter,
  ChapterType.Introduction,
  ChapterType.ExhibitionCatalogChapter,
];

export const ChapterForm = () => {
  const { t } = useTranslation();

  const { values } = useFormikContext<ChapterRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type ?? '';

  return (
    <>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <InfoIcon color="primary" />
          <Typography variant="body1" gutterBottom>
            {anthologyChapterTypes.includes(instanceType)
              ? t('registration.resource_type.chapter.info_anthology')
              : instanceType === ChapterType.ConferenceAbstract
                ? t('registration.resource_type.chapter.info_book_of_abstracts')
                : instanceType === ChapterType.ReportChapter
                  ? t('registration.resource_type.chapter.info_report')
                  : null}
          </Typography>
        </Box>

        {anthologyChapterTypes.includes(instanceType) ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PublicationContextId}
            searchSubtypes={[BookType.Anthology]}
            label={t('registration.resource_type.chapter.published_in')}
            placeholder={t('registration.resource_type.chapter.search_for_anthology')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback.error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : instanceType === ChapterType.ConferenceAbstract ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PublicationContextId}
            searchSubtypes={[ReportType.BookOfAbstracts]}
            label={t('registration.resource_type.chapter.published_in')}
            placeholder={t('registration.resource_type.chapter.search_for_book_of_abstracts')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback.error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : instanceType === ChapterType.ReportChapter ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PublicationContextId}
            searchSubtypes={Object.values(ReportType)}
            label={t('registration.resource_type.chapter.published_in')}
            placeholder={t('registration.resource_type.chapter.search_for_report')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback.error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : null}
      </div>

      <NpiDisciplineField />

      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Field name={ResourceFieldNames.PagesFrom}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              variant="filled"
              data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
              label={t('registration.resource_type.pages_from')}
              {...field}
              value={field.value ?? ''}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>

        <RemoveIcon />

        <Field name={ResourceFieldNames.PagesTo}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.pagesToField}
              variant="filled"
              label={t('registration.resource_type.pages_to')}
              {...field}
              value={field.value ?? ''}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </Box>

      {instanceType === ChapterType.AcademicChapter ? <NviValidation registration={values} /> : null}
    </>
  );
};
