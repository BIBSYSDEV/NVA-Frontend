import { useFormikContext } from 'formik';
import React from 'react';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ReferenceFieldNames, ChapterType } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import ChapterForm from './sub_type_forms/ChapterForm';

interface ChapterTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const JournalTypeForm = (props: ChapterTypeFormProps) => {
  const { values } = useFormikContext<Registration>();
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

      {subtype && <ChapterForm subtype={subtype} />}
    </>
  );
};

export default JournalTypeForm;
