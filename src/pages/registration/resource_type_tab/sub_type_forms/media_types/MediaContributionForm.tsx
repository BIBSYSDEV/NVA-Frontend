import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames, MediaType } from '../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../types/registration.types';
import { SelectTypeField } from '../../components/SelectTypeField';
import { RegistrationTypeFormProps } from '../../JournalTypeForm';
import { MediaContributionForm } from '../../MediaTypeForm';

export const MediaTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<Registration>();
  const subType = values.entityDescription?.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(MediaType)}
        />
      </StyledSelectWrapper>

      {subType && <MediaContributionForm />}
    </>
  );
};
