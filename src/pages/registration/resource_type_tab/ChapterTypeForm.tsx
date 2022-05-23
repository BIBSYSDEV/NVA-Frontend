import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ChapterType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ChapterRegistration } from '../../../types/publication_types/chapterRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { ChapterForm } from './sub_type_forms/ChapterForm';

interface ChapterTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const ChapterTypeForm = ({ onChangeSubType }: ChapterTypeFormProps) => {
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
