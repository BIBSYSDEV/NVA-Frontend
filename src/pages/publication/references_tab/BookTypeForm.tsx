import React, { FC } from 'react';
import { ReferenceFieldNames, BookType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import BookForm from './sub_type_forms/BookForm';
import { FormikProps, useFormikContext } from 'formik';
import { BookPublication } from '../../../types/publication.types';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';

const BookTypeForm: FC = () => {
  const { values }: FormikProps<BookPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(BookType)} />
      </StyledSelectWrapper>

      {subType && <BookForm />}
    </>
  );
};

export default BookTypeForm;
