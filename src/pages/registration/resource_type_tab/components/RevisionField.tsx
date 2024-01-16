import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Checkbox, FormControlLabel } from '@mui/material';
import { BookRegistration, Revision } from '../../../../types/publication_types/bookRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

export const RevisionField = () => {
  const { setFieldValue } = useFormikContext<BookRegistration>();
  const { t } = useTranslation();

  return (
    <Field name={ResourceFieldNames.Revision}>
      {({ field }: FieldProps<Revision | null | undefined>) => (
        <FormControlLabel
          label={t('registration.is_revision')}
          control={
            <Checkbox
              checked={Revision.Revised === field.value}
              inputProps={{ 'aria-label': t('registration.is_revision') }}
              data-testid={dataTestId.registrationWizard.resourceType.revisionField}
              {...field}
              onChange={(_event, checked) => {
                setFieldValue(ResourceFieldNames.Revision, checked ? Revision.Revised : Revision.Unrevised);
              }}
            />
          }
        />
      )}
    </Field>
  );
};
