import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { JournalType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { JournalForm } from './sub_type_forms/JournalForm';

export interface RegistrationTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const JournalTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<JournalRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(JournalType)}
        />
      </StyledSelectWrapper>

      {subType && <JournalForm />}
    </>
  );
};
