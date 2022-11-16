import { useFormikContext } from 'formik';
import { BookRegistration } from '../../../types/publication_types/bookRegistration.types';
import { BookForm } from './sub_type_forms/BookForm';

export const BookTypeForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return subType ? <BookForm /> : null;
};
