import InfoIcon from '@mui/icons-material/Info';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BookType, ChapterType, ReportType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';

const generalChapterTypes: string[] = [
  ChapterType.AcademicChapter,
  ChapterType.NonFictionChapter,
  ChapterType.PopularScienceChapter,
  ChapterType.TextbookChapter,
  ChapterType.EncyclopediaChapter,
  ChapterType.Introduction,
  ChapterType.ExhibitionCatalogChapter,
];

const generalChapterParentTypes = [...Object.values(BookType), ...Object.values(ReportType)];

export const ChapterForm = () => {
  const { t } = useTranslation();

  const { values } = useFormikContext<ChapterRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type ?? '';
  const isNviApplicable = nviApplicableTypes.includes(instanceType as PublicationInstanceType);

  return (
    <>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', mb: '0.25rem', alignItems: 'center' }}>
          <InfoIcon color="primary" />
          <Typography variant="body1">
            {generalChapterTypes.includes(instanceType)
              ? t('registration.resource_type.chapter.info_anthology')
              : instanceType === ChapterType.ConferenceAbstract
                ? t('registration.resource_type.chapter.info_book_of_abstracts')
                : instanceType === ChapterType.ReportChapter
                  ? t('registration.resource_type.chapter.info_report')
                  : null}
          </Typography>
        </Box>

        {generalChapterTypes.includes(instanceType) ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PublicationContextId}
            searchSubtypes={generalChapterParentTypes}
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

      <NpiDisciplineField required={isNviApplicable} />

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

      {isNviApplicable ? <NviValidation registration={values} /> : null}
    </>
  );
};
