import { TextField, MenuItem } from '@material-ui/core';
import { Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ContentTypeOption, nviApplicableContentTypes } from '../../../../../types/publication_types/content.types';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface ContentTypeFieldProps {
  options: ContentTypeOption[];
}

export const ContentTypeField = ({ options }: ContentTypeFieldProps) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={ResourceFieldNames.ContentType}>
      {({ field, meta: { error, touched } }: FieldProps) => (
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
                setFieldValue(ResourceFieldNames.OriginalResearch, null, false);
              }
            }}
            label={t('resource_type.content')}
            fullWidth
            required
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}>
            {options.map(({ value, text }) => (
              <MenuItem value={value} key={value}>
                {text}
              </MenuItem>
            ))}
          </TextField>
        </StyledSelectWrapper>
      )}
    </Field>
  );
};
