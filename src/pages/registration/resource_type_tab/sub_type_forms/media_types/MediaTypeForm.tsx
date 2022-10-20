import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames, MediaType } from '../../../../../types/publicationFieldNames';
import { MediaRegistration } from '../../../../../types/publication_types/mediaContributionRegistration.types';
import { SelectTypeField } from '../../components/SelectTypeField';
import { RegistrationTypeFormProps } from '../../JournalTypeForm';
import { MediaContributionForm } from './MediaContributionForm';
import { MediaContributionPeriodicalForm } from './MediaContributionPeriodicalForm';

export const MediaTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<MediaRegistration>();
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

      {subType &&
        (subType === MediaType.MediaFeatureArticle || subType === MediaType.MediaReaderOpinion ? (
          <MediaContributionPeriodicalForm />
        ) : (
          <MediaContributionForm />
        ))}
    </>
  );
};
