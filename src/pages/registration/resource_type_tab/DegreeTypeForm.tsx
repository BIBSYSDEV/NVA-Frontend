import { useFormikContext } from 'formik';
import { DegreeRegistration } from '../../../types/publication_types/degreeRegistration.types';
import { DegreeForm } from './sub_type_forms/DegreeForm';

export const DegreeTypeForm = () => {
  const { values } = useFormikContext<DegreeRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return subType ? <DegreeForm subType={subType} /> : null;
};
