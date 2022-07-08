import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ArtisticType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { ArtisticRegistration } from '../../../types/publication_types/artisticRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { ArtisticArchitectureForm } from './sub_type_forms/artistic_types/architecture/ArtisticArchitectureForm';
import { ArtisticDesignForm } from './sub_type_forms/artistic_types/design/ArtisticDesignForm';
import { ArtisticPerformingArtsForm } from './sub_type_forms/artistic_types/performing_arts/ArtisticPerformingArtsForm';

interface ArtisticTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const ArtisticTypeForm = ({ onChangeSubType }: ArtisticTypeFormProps) => {
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

      {subType === ArtisticType.ArtisticDesign && <ArtisticDesignForm />}

      {subType === ArtisticType.ArtisticArchitecture && (
        <BetaFunctionality>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ArtisticArchitectureForm />
          </Box>
        </BetaFunctionality>
      )}
      {subType === ArtisticType.PerformingArts && <ArtisticPerformingArtsForm />}
    </>
  );
};
