import { TextField, MenuItem } from '@material-ui/core';
import { Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
  nviApplicableContentTypes,
} from '../../../../../types/publication_types/content.types';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface ContentTypeFieldProps {
  contentTypes: JournalArticleContentType[] | BookMonographContentType[] | ChapterContentType[];
}

export const ContentTypeField = ({ contentTypes }: ContentTypeFieldProps) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  const contentTypeOptions = contentTypes.map((contentType) => ({
    value: contentType,
    text: t(`registration:resource_type.content_types.${contentType}`),
  }));

  return (
    <Field name={ResourceFieldNames.ContentType}>
      {({ field, meta: { error, touched } }: FieldProps<string>) => (
        <StyledSelectWrapper>
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.contentField}
            select
            variant="filled"
            value={field.value ?? ''}
            onChange={(event) => {
              field.onChange(event);
              if (!nviApplicableContentTypes.includes(event.target.value)) {
                setFieldValue(ResourceFieldNames.PEER_REVIEW, null, false);
              }
            }}
            label={t('resource_type.content')}
            fullWidth
            required
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}>
            {contentTypeOptions.map(({ value, text }) => (
              <MenuItem
                value={value}
                key={value}
                data-testid={dataTestId.registrationWizard.resourceType.contentValue(value)}>
                {text}
              </MenuItem>
            ))}
          </TextField>
        </StyledSelectWrapper>
      )}
    </Field>
  );
};
