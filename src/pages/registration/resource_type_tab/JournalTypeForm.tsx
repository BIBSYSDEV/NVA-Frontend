import { useFormikContext } from 'formik';
import React from 'react';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { JournalType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { JournalForm } from './sub_type_forms/JournalForm';

interface JournalTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const JournalTypeForm = ({ onChangeSubType }: JournalTypeFormProps) => {
  const { values } = useFormikContext<JournalRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(JournalType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <JournalForm />}
    </>
  );
};
