import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Typography } from '@mui/material';
import { JournalType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';
import { JournalArticleContentType } from '../../../../types/publication_types/content.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { JournalField } from '../components/JournalField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { ContentTypeField } from '../components/ContentTypeField';

export const JournalForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<JournalRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <InputContainerBox>
        <DoiField />

        {instanceType === JournalType.Corrigendum ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.CorrigendumFor}
            searchSubtypes={[JournalType.Article]}
            label={t('registration.resource_type.original_article_title')}
            placeholder={t('registration.resource_type.search_for_original_article')}
            dataTestId={dataTestId.registrationWizard.resourceType.corrigendumForField}
            fetchErrorMessage={t('feedback.error.get_journal_article')}
          />
        ) : (
          <JournalField />
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4,1fr) auto 1fr' },
            gap: '1rem',
            alignItems: 'center',
          }}>
          <Field name={ResourceFieldNames.Volume}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                data-testid={dataTestId.registrationWizard.resourceType.volumeField}
                variant="filled"
                label={t('registration.resource_type.volume')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.Issue}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                value={field.value ?? ''}
                data-testid={dataTestId.registrationWizard.resourceType.issueField}
                variant="filled"
                label={t('registration.resource_type.issue')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.PagesFrom}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
                value={field.value ?? ''}
                variant="filled"
                label={t('registration.resource_type.pages_from')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Field name={ResourceFieldNames.PagesTo}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.pagesToField}
                variant="filled"
                label={t('registration.resource_type.pages_to')}
                value={field.value ?? ''}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>

          <Typography>{t('registration.resource_type.or')}</Typography>

          <Field name={ResourceFieldNames.ArticleNumber}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                {...field}
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.articleNumberField}
                value={field.value ?? ''}
                variant="filled"
                label={t('registration.resource_type.article_number')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        </Box>
      </InputContainerBox>

      {instanceType === JournalType.Article && (
        <>
          <ContentTypeField contentTypes={Object.values(JournalArticleContentType)} />
          <NviValidation registration={values} />
        </>
      )}
    </>
  );
};
