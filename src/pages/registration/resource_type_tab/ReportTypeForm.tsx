import { useFormikContext } from 'formik';
import React from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import lightTheme from '../../../themes/lightTheme';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import { ReportRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import ReportForm from './sub_type_forms/ReportForm';

interface ReportTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const ReportTypeForm = ({ onChangeSubType }: ReportTypeFormProps) => {
  const { values } = useFormikContext<ReportRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ReferenceFieldNames.SUB_TYPE}
            onChangeType={onChangeSubType}
            options={Object.values(ReportType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <ReportForm />}
    </>
  );
};

export default ReportTypeForm;
