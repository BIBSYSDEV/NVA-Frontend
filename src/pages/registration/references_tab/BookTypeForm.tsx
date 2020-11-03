import React, { FC } from 'react';
import { ReferenceFieldNames, BookType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import BookForm from './sub_type_forms/BookForm';
import { useFormikContext } from 'formik';
import { BookRegistration } from '../../../types/registration.types';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

interface BookTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const BookTypeForm: FC<BookTypeFormProps> = ({ onChangeSubType }) => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ReferenceFieldNames.SUB_TYPE}
          onChangeType={onChangeSubType}
          options={Object.values(BookType)}
        />
      </StyledSelectWrapper>

      {subType && <BookForm />}
    </>
  );
};

export default BookTypeForm;
