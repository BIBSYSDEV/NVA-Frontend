import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { DegreePublication } from '../../../types/publication.types';
import { ReferenceFieldNames, DegreeType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import DegreeForm from './sub_type_forms/DegreeForm';
import styled from 'styled-components';

const StyledSelectContainer = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

const DegreeTypeForm: FC = () => {
  const { values }: FormikProps<DegreePublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectContainer>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(DegreeType)} />
      </StyledSelectContainer>

      {subType && <DegreeForm />}
    </>
  );
};

export default DegreeTypeForm;
