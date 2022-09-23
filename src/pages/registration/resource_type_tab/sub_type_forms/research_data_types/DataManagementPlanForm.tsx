import { Autocomplete, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { PublisherField } from '../../components/PublisherField';

export const DataManagementPlanForm = () => {
  return (
    <>
      <PublisherField />

      <Field name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ field, form: { setFieldValue } }: FieldProps<string[]>) => (
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={field.value}
            onChange={(_, value) => {
              setFieldValue(field.name, value);
            }}
            renderInput={(params) => <TextField {...params} required variant="filled" label="Lenker" />}
          />
        )}
      </Field>
    </>
  );
};
