import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { DegreePublication } from '../../../types/publication.types';
import { ReferenceFieldNames, DegreeType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import DegreeForm from './sub_type_forms/DegreeForm';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

const DegreeTypeForm: FC = () => {
  const { values }: FormikProps<DegreePublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(DegreeType)} />
      </StyledSelectWrapper>

      {subType && <DegreeForm />}
    </>
  );
};

export default DegreeTypeForm;
