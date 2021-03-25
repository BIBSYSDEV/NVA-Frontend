import { useFormikContext } from 'formik';
import React from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import lightTheme from '../../../themes/lightTheme';
import { ChapterType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import ChapterForm from './sub_type_forms/ChapterForm';

interface ChapterTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const JournalTypeForm = ({ onChangeSubType }: ChapterTypeFormProps) => {
  const { values } = useFormikContext<ChapterRegistration>();
  const subtype = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SUB_TYPE}
            onChangeType={onChangeSubType}
            options={Object.values(ChapterType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subtype && <ChapterForm />}
    </>
  );
};

export default JournalTypeForm;
