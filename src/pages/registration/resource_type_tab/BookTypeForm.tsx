import { useFormikContext } from 'formik';
import React from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import lightTheme from '../../../themes/lightTheme';
import { BookType, ReferenceFieldNames } from '../../../types/publicationFieldNames';
import { BookRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import BookForm from './sub_type_forms/BookForm';

interface BookTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const BookTypeForm = ({ onChangeSubType }: BookTypeFormProps) => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ReferenceFieldNames.SUB_TYPE}
            onChangeType={onChangeSubType}
            options={Object.values(BookType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <BookForm />}
    </>
  );
};

export default BookTypeForm;
