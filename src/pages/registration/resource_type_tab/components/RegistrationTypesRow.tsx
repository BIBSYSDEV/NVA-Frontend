import { Typography, Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { PublicationType } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';

interface RegistrationTypesRowProps {
  onChangeType: (type: PublicationInstanceType) => void;
  mainType: PublicationType;
  subTypes: RegistrationTypeElement[];
  value: string;
}

export interface RegistrationTypeElement {
  value: PublicationInstanceType;
  text: string;
}

export const RegistrationTypesRow = ({ mainType, subTypes, value, onChangeType }: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t(`registration.publication_types.${mainType}`)}</Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {subTypes.map((subType) => (
          <Chip
            data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(subType.value)}
            key={subType.value}
            icon={
              nviApplicableTypes.includes(subType.value) ? (
                <FilterVintageIcon
                  titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                  fontSize="small"
                />
              ) : undefined
            }
            variant={value === subType.value ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => onChangeType(subType.value)}
            label={subType.text}
          />
        ))}
      </Box>
    </>
  );
};
