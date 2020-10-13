import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { JournalPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, JournalType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import JournalArticleForm from './sub_type_forms/JournalArticleForm';
import JournalForm from './sub_type_forms/JournalForm';

const JournalTypeForm: FC = () => {
  const { values, setFieldValue }: FormikProps<JournalPublication> = useFormikContext();

  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <SelectTypeField
        fieldName={ReferenceFieldNames.SUB_TYPE}
        options={Object.values(JournalType)}
        onChangeType={(newType) => {
          setFieldValue(ReferenceFieldNames.SUB_TYPE, newType, false);
          // Only JournalArticle can be peer reviewed, so ensure it is set to false when type is changed
          setFieldValue(ReferenceFieldNames.PEER_REVIEW, false);
        }}
      />

      {subType && (subType === JournalType.ARTICLE ? <JournalArticleForm /> : <JournalForm />)}
    </>
  );
};

export default JournalTypeForm;
