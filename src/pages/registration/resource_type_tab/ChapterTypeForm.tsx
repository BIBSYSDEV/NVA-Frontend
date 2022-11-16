import { useFormikContext } from 'formik';
import { ChapterRegistration } from '../../../types/publication_types/chapterRegistration.types';
import { ChapterForm } from './sub_type_forms/ChapterForm';

export const ChapterTypeForm = () => {
  const { values } = useFormikContext<ChapterRegistration>();
  const subtype = values.entityDescription.reference?.publicationInstance.type;

  return subtype ? <ChapterForm /> : null;
};
