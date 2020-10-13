import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { DegreePublication } from '../../../types/publication.types';
import { ReferenceFieldNames, DegreeType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import DegreeForm from './sub_type_forms/DegreeForm';

const DegreeTypeForm: FC = () => {
  const { values }: FormikProps<DegreePublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(DegreeType)} />
      {subType && <DegreeForm />}
    </>
  );
};

export default DegreeTypeForm;
