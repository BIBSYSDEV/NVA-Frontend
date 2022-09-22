import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ResearchDataType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../types/publication_types/researchDataRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { DataManagementPlanForm } from './sub_type_forms/research_data_types/DataManagementPlanForm';

interface ResearchDataTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const ResearchDataTypeForm = ({ onChangeSubType }: ResearchDataTypeFormProps) => {
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

      {subType === ResearchDataType.DataManagementPlan ? <DataManagementPlanForm /> : null}
    </>
  );
};
