import { useTranslation } from 'react-i18next';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';

const FormikDatePicker = ({ form: { setFieldValue }, field: { value, name } }: any) => {
  const { t } = useTranslation();
  return (
    <KeyboardDatePicker
      inputVariant="outlined"
      label={t('resource_form.publication_date')}
      name={name}
      onChange={value => {
        setFieldValue(name, value);
      }}
      value={value}
    />
  );
};

export default FormikDatePicker;
