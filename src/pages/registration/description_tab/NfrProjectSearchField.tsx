import { Field, FieldProps } from 'formik';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';
import { SpecificFundingFieldNames } from '../../../types/publicationFieldNames';
import { Funding } from '../../../types/registration.types';

interface NfrProjectSearchProps {
  baseFieldName: string;
}

export const NfrProjectSearchField = ({ baseFieldName }: NfrProjectSearchProps) => (
  <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Id}`}>
    {({ field: { onBlur }, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
      <NfrProjectSearch
        onSelectProject={(project) => {
          if (project) {
            const { lead, ...rest } = project;
            const nfrFunding: Funding = {
              type: 'ConfirmedFunding',
              ...rest,
            };
            setFieldValue(baseFieldName, nfrFunding);
          }
        }}
        required
        onBlur={onBlur}
        errorMessage={touched && !!error ? error : undefined}
      />
    )}
  </Field>
);
