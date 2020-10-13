import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { ReportPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import ReportForm from './sub_type_forms/ReportForm';
import styled from 'styled-components';

const StyledSelectContainer = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

const ReportTypeForm: FC = () => {
  const { values }: FormikProps<ReportPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectContainer>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />
      </StyledSelectContainer>

      {subType && <ReportForm />}
    </>
  );
};

export default ReportTypeForm;
