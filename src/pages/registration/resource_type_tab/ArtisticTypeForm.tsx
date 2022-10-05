import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ArtisticType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ArtisticRegistration } from '../../../types/publication_types/artisticRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { RegistrationTypeFormProps } from './JournalTypeForm';
import { ArtisticArchitectureForm } from './sub_type_forms/artistic_types/architecture/ArtisticArchitectureForm';
import { ArtisticDesignForm } from './sub_type_forms/artistic_types/design/ArtisticDesignForm';
import { ArtisticMovingPictureForm } from './sub_type_forms/artistic_types/moving_picture/ArtisticMovingPictureForm';
import { ArtisticMusicPerformanceForm } from './sub_type_forms/artistic_types/music_performance/ArtisticMusicPerformanceForm';
import { ArtisticPerformingArtsForm } from './sub_type_forms/artistic_types/performing_arts/ArtisticPerformingArtsForm';

export const ArtisticTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<ArtisticRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(ArtisticType)}
        />
      </StyledSelectWrapper>

      {subType === ArtisticType.ArtisticDesign ? (
        <ArtisticDesignForm />
      ) : subType === ArtisticType.ArtisticArchitecture ? (
        <ArtisticArchitectureForm />
      ) : subType === ArtisticType.PerformingArts ? (
        <ArtisticPerformingArtsForm />
      ) : subType === ArtisticType.MovingPicture ? (
        <ArtisticMovingPictureForm />
      ) : subType === ArtisticType.MusicPerformance ? (
        <ArtisticMusicPerformanceForm />
      ) : null}
    </>
  );
};
