import { Autocomplete, TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { PublisherField } from '../../components/PublisherField';

export const DataManagementPlanForm = () => {
  return (
    <>
      <PublisherField />

      <Field name="related">
        {({ field }: FieldProps<string[]>) => (
          <Autocomplete
            multiple
            options={[]}
            freeSolo
            renderInput={(params) => <TextField {...field} {...params} required variant="filled" label="Lenker" />}
          />
        )}
      </Field>
    </>
  );
};
