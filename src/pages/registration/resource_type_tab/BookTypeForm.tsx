import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { BookType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { BookRegistration } from '../../../types/publication_types/bookRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { BookForm } from './sub_type_forms/BookForm';

interface BookTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const BookTypeForm = ({ onChangeSubType }: BookTypeFormProps) => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(BookType)}
        />
      </StyledSelectWrapper>

      {subType && <BookForm />}
    </>
  );
};
