import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { ReportRegistration } from '../../../types/registration.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import ReportForm from './sub_type_forms/ReportForm';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

interface ReportTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const ReportTypeForm: FC<ReportTypeFormProps> = ({ onChangeSubType }) => {
  const { values }: FormikProps<ReportRegistration> = useFormikContext();
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
