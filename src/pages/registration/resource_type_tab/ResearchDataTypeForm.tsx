import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ResearchDataType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../types/publication_types/researchDataRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { RegistrationTypeFormProps } from './JournalTypeForm';
import { DataManagementPlanForm } from './sub_type_forms/research_data_types/DataManagementPlanForm';
import { DatasetForm } from './sub_type_forms/research_data_types/DatasetForm';

export const ResearchDataTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<ResearchDataRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(ResearchDataType)}
        />
      </StyledSelectWrapper>

      {subType === ResearchDataType.DataManagementPlan ? (
        <DataManagementPlanForm />
      ) : subType === ResearchDataType.Dataset ? (
        <DatasetForm />
      ) : null}
    </>
  );
};
