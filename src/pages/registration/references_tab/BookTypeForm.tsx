import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import BackgroundDiv from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import theme from '../../../themes/mainTheme';
import { BookType, ReferenceFieldNames } from '../../../types/publicationFieldNames';
import { BookRegistration } from '../../../types/registration.types';
import SelectTypeField from './components/SelectTypeField';
import BookForm from './sub_type_forms/BookForm';

interface BookTypeFormProps {
  onChangeSubType: (type: string) => void;
}

const BookTypeForm: FC<BookTypeFormProps> = ({ onChangeSubType }) => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
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
