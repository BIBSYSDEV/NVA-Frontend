import { useFormikContext } from 'formik';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { JournalForm } from './sub_type_forms/JournalForm';

export const JournalTypeForm = () => {
  const { values } = useFormikContext<JournalRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return subType ? <JournalForm /> : null;
};
