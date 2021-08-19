import { useFormikContext } from 'formik';
import React from 'react';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { BookType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { BookRegistration } from '../../../types/publication_types/bookRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { BookForm } from './sub_type_forms/BookForm';

interface BookTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const BookTypeForm = ({ onChangeSubType }: BookTypeFormProps) => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(BookType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <BookForm />}
    </>
  );
};
