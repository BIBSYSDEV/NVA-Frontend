import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import theme from '../../../themes/mainTheme';
import { DegreeType, ReferenceFieldNames } from '../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import DegreeForm from './sub_type_forms/DegreeForm';

interface DegreeTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const DegreeTypeForm: FC<DegreeTypeFormProps> = ({ onChangeSubType }) => {
  const { values } = useFormikContext<DegreeRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ReferenceFieldNames.SUB_TYPE}
            onChangeType={onChangeSubType}
            options={Object.values(DegreeType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <DegreeForm />}
    </>
  );
};

export default DegreeTypeForm;
