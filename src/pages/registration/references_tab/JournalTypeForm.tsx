import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import theme from '../../../themes/mainTheme';
import { JournalType, ReferenceFieldNames } from '../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import JournalForm from './sub_type_forms/JournalForm';

interface JournalTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const JournalTypeForm: FC<JournalTypeFormProps> = ({ onChangeSubType }) => {
  const { values } = useFormikContext<JournalRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ReferenceFieldNames.SUB_TYPE}
            onChangeType={onChangeSubType}
            options={Object.values(JournalType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <JournalForm />}
    </>
  );
};

export default JournalTypeForm;
