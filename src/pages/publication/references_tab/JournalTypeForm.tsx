import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { JournalPublication } from '../../../types/publication.types';
import { ReferenceFieldNames, JournalType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import JournalArticleForm from './sub_type_forms/JournalArticleForm';
import JournalForm from './sub_type_forms/JournalForm';
import styled from 'styled-components';

const StyledSelectContainer = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

const JournalTypeForm: FC = () => {
  const { values }: FormikProps<JournalPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectContainer>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(JournalType)} />
      </StyledSelectContainer>

      {subType && (subType === JournalType.ARTICLE ? <JournalArticleForm /> : <JournalForm />)}
    </>
  );
};

export default JournalTypeForm;
