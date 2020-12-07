import React, { FC } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { Registration } from '../../../../types/registration.types';
import JournalField from './JournalField';

const CorrigendumForField: FC = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <>
      <JournalField disabled />
    </>
  );
};

export default CorrigendumForField;
