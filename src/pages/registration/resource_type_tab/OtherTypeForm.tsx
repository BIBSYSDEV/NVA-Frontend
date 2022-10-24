import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { OtherRegistrationType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { MapRegistration } from '../../../types/publication_types/otherRegistration.types';
import { PublisherField } from './components/PublisherField';
import { SelectTypeField } from './components/SelectTypeField';
import { RegistrationTypeFormProps } from './JournalTypeForm';

export const OtherTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<MapRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(OtherRegistrationType)}
        />
      </StyledSelectWrapper>

      {subType === OtherRegistrationType.Map && <PublisherField />}
    </>
  );
};
