import React, { FC } from 'react';
import styled from 'styled-components';
import { ReferenceFieldNames, BookType } from '../../../types/publicationFieldNames';
import SelectTypeField from './components/SelectTypeField';
import BookForm from './sub_type_forms/BookForm';
import { FormikProps, useFormikContext } from 'formik';
import { BookPublication } from '../../../types/publication.types';

const StyledContent = styled.div`
  display: grid;
  gap: 1rem;
`;

const StyledSelectContainer = styled.div`
  width: 50%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 1rem;
    width: 100%;
  }
`;

const BookTypeForm: FC = () => {
  const { values }: FormikProps<BookPublication> = useFormikContext();
  const subType = values.entityDescription.reference.publicationInstance.type;
  return (
    <StyledContent>
      <StyledSelectContainer>
        <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(BookType)} />
      </StyledSelectContainer>
      {subType && <BookForm />}
    </StyledContent>
  );
};

export default BookTypeForm;
