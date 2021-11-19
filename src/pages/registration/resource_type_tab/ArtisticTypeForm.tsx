import { useFormikContext } from 'formik';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { ArtisticType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ArtisticRegistration } from '../../../types/publication_types/artisticRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { ArtisticDesignForm } from './sub_type_forms/artistic_types/design/ArtisticDesignForm';

interface ArtisticTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const ArtisticTypeForm = ({ onChangeSubType }: ArtisticTypeFormProps) => {
  const { values } = useFormikContext<ArtisticRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(ArtisticType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType === ArtisticType.ArtisticDesign && <ArtisticDesignForm />}
    </>
  );
};
