import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RemoveIcon from '@mui/icons-material/Remove';
import { BookType, ChapterType, ReportType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';
import { NviFields } from '../components/nvi_fields/NviFields';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { ChapterContentType } from '../../../../types/publication_types/content.types';
import { dataTestId } from '../../../../utils/dataTestIds';

export const ChapterForm = () => {
  const { t } = useTranslation('registration');

  const { values } = useFormikContext<ChapterRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  // TODO reset partOf when instanceType changes

  return (
    <>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <InfoIcon color="primary" />
          <Typography variant="body1" gutterBottom>
            {instanceType === ChapterType.AnthologyChapter
              ? t('resource_type.chapter.info_anthology')
              : instanceType === ChapterType.ConferenceAbstract
              ? t('resource_type.chapter.info_book_of_abstracts')
              : instanceType === ChapterType.ReportChapter
              ? t('resource_type.chapter.info_report')
              : null}
          </Typography>
        </Box>

        <DoiField />

        {instanceType === ChapterType.AnthologyChapter ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PartOf}
            searchSubtypes={[BookType.Anthology]}
            label={t('resource_type.chapter.published_in')}
            placeholder={t('resource_type.chapter.search_for_anthology')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback:error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : instanceType === ChapterType.ConferenceAbstract ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PartOf}
            searchSubtypes={[ReportType.BookOfAbstract]}
            label={t('resource_type.chapter.published_in')}
            placeholder={t('resource_type.chapter.search_for_book_of_abstracts')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback:error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : instanceType === ChapterType.ReportChapter ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.PartOf}
            searchSubtypes={Object.values(ReportType)}
            label={t('resource_type.chapter.published_in')}
            placeholder={t('resource_type.chapter.search_for_report')}
            dataTestId={dataTestId.registrationWizard.resourceType.partOfField}
            fetchErrorMessage={t('feedback:error.search')}
            descriptionToShow="publisher-and-level"
          />
        ) : null}
      </div>

      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Field name={ResourceFieldNames.PagesFrom}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              variant="filled"
              data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
              label={t('resource_type.pages_from')}
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
              label={t('resource_type.pages_to')}
              {...field}
              value={field.value ?? ''}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </Box>

      {instanceType === ChapterType.AnthologyChapter && (
        <>
          <NviFields contentTypes={Object.values(ChapterContentType)} />

          <NviValidation registration={values} />
        </>
      )}
    </>
  );
};
