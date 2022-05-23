import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { DegreeType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../types/publication_types/degreeRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { DegreeForm } from './sub_type_forms/DegreeForm';

interface DegreeTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const DegreeTypeForm = ({ onChangeSubType }: DegreeTypeFormProps) => {
  const { values } = useFormikContext<DegreeRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(DegreeType)}
        />
      </StyledSelectWrapper>

      {subType && <DegreeForm subType={subType} />}
    </>
  );
};
