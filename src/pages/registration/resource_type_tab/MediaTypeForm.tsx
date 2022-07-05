import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { MediaType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { MediaContributionRegistration } from '../../../types/publication_types/mediaContributionRegistration';
import { SelectTypeField } from './components/SelectTypeField';

interface MediaTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const MediaTypeForm = ({ onChangeSubType }: MediaTypeFormProps) => {
  const { values } = useFormikContext<MediaContributionRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(MediaType)}
        />
      </StyledSelectWrapper>

      {subType && <></>}
    </>
  );
};
