import { useFormikContext } from 'formik';
import React from 'react';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { DegreeType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../types/registration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { DegreeForm } from './sub_type_forms/DegreeForm';

interface DegreeTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const DegreeTypeForm = ({ onChangeSubType }: DegreeTypeFormProps) => {
  const { values } = useFormikContext<DegreeRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(DegreeType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <DegreeForm subType={subType} />}
    </>
  );
};
