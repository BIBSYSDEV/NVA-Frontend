import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { JournalPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, JournalType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import JournalArticleForm from './sub_type_forms/JournalArticleForm';
import JournalForm from './sub_type_forms/JournalForm';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

const JournalTypeForm: FC = () => {
  const { values }: FormikProps<JournalPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(JournalType)} />
      </StyledSelectWrapper>

      {subType && (subType === JournalType.ARTICLE ? <JournalArticleForm /> : <JournalForm />)}
    </>
  );
};

export default JournalTypeForm;
