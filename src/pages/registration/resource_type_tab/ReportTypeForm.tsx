import { useFormikContext } from 'formik';
import { ReportRegistration } from '../../../types/publication_types/reportRegistration.types';
import { ReportForm } from './sub_type_forms/ReportForm';

export const ReportTypeForm = () => {
  const { values } = useFormikContext<ReportRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return subType ? <ReportForm /> : null;
};
