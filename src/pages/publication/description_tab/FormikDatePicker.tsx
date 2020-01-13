import React from 'react';
import { useTranslation } from 'react-i18next';

import { KeyboardDatePicker } from '@material-ui/pickers';

const FormikDatePicker = ({ form: { setFieldValue }, field: { value, name } }: any) => {
  const { t } = useTranslation();
  return (
    <KeyboardDatePicker
      inputVariant="outlined"
      label={t('publication:publication.date')}
      name={name}
      onChange={value => {
        setFieldValue(name, value?.getFullYear());
      }}
      views={['year']}
      value={value ? new Date(value, 1) : ''}
    />
  );
};

export default FormikDatePicker;
