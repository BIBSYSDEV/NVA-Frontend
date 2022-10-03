import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ChapterType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../types/publication_types/chapterRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { RegistrationTypeFormProps } from './JournalTypeForm';
import { ChapterForm } from './sub_type_forms/ChapterForm';

export const ChapterTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<ChapterRegistration>();
  const subtype = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(ChapterType)}
        />
      </StyledSelectWrapper>

      {subtype && <ChapterForm />}
    </>
  );
};
