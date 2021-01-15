import React from 'react';
import { useFormikContext } from 'formik';
import SelectTypeField from './components/SelectTypeField';
import ChapterForm from './sub_type_forms/ChapterForm';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ChapterRegistration } from '../../../types/registration.types';
import { ReferenceFieldNames, ChapterType } from '../../../types/publicationFieldNames';

interface ChapterTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const JournalTypeForm = (props: ChapterTypeFormProps) => {
  const { values } = useFormikContext<ChapterRegistration>();
  const subtype = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ReferenceFieldNames.SUB_TYPE}
          onChangeType={props.onChangeSubType}
          options={Object.values(ChapterType)}
        />
      </StyledSelectWrapper>

      {subtype && <ChapterForm />}
    </>
  );
};

export default JournalTypeForm;
