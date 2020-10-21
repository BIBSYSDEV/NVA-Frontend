import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { ReportPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import ReportForm from './sub_type_forms/ReportForm';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

interface ReportTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const ReportTypeForm: FC<ReportTypeFormProps> = ({ onChangeSubType }) => {
  const { values }: FormikProps<ReportPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ReferenceFieldNames.SUB_TYPE}
          onChangeType={onChangeSubType}
          options={Object.values(ReportType)}
        />
      </StyledSelectWrapper>

      {subType && <ReportForm />}
    </>
  );
};

export default ReportTypeForm;
