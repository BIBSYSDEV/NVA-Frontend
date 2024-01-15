import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Checkbox, FormControlLabel, InputProps } from '@mui/material';
import { BookRegistration, Revision } from '../../../../types/publication_types/bookRegistration.types';

export const RevisionField = () => {
  const { setFieldValue } = useFormikContext<BookRegistration>();
  const { t } = useTranslation();

  const handleRevisionChange = (checked: boolean, field: InputProps) => {
    setFieldValue(ResourceFieldNames.Revision, checked ? Revision.REVISED : Revision.UNREVISED);
  };

  return (
    <Field name={ResourceFieldNames.Revision}>
      {({ field }: FieldProps) => (
        <FormControlLabel
          label={t('registration.is_revision')}
          control={
            <Checkbox
              checked={Revision.REVISED === field.value}
              inputProps={{ 'aria-label': t('registration.is_revision') }}
              id="book-revision-checkbox"
              {...field}
              onChange={(_event, checked) => {
                handleRevisionChange(checked, field);
              }}
            />
          }
        />
      )}
    </Field>
  );
};
