import { useFormikContext } from 'formik';
import { ResearchDataType } from '../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../types/publication_types/researchDataRegistration.types';
import { DataManagementPlanForm } from './sub_type_forms/research_data_types/DataManagementPlanForm';
import { DatasetForm } from './sub_type_forms/research_data_types/DatasetForm';

export const ResearchDataTypeForm = () => {
  const { values } = useFormikContext<ResearchDataRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return subType === ResearchDataType.DataManagementPlan ? (
    <DataManagementPlanForm />
  ) : subType === ResearchDataType.Dataset ? (
    <DatasetForm />
  ) : null;
};
