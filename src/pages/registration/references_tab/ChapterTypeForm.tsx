import { useFormikContext } from 'formik';
import React from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import theme from '../../../themes/mainTheme';
import { ChapterType, ReferenceFieldNames } from '../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import ChapterForm from './sub_type_forms/ChapterForm';

interface ChapterTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const JournalTypeForm = (props: ChapterTypeFormProps) => {
  const { values } = useFormikContext<ChapterRegistration>();
  const subtype = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ReferenceFieldNames.SUB_TYPE}
            onChangeType={props.onChangeSubType}
            options={Object.values(ChapterType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subtype && <ChapterForm />}
    </>
  );
};

export default JournalTypeForm;
