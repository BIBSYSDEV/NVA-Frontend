import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { ReportPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import ReportForm from './sub_type_forms/ReportForm';

const ReportTypeForm: FC = () => {
  const { values }: FormikProps<ReportPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />

      {subType && <ReportForm />}
    </>
  );
};

export default ReportTypeForm;
