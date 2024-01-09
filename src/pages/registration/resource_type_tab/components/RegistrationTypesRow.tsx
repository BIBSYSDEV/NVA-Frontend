import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicationType } from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';

interface RegistrationTypesRowProps {
  onChangeType: (type: PublicationInstanceType) => void;
  mainType: PublicationType;
  registrationTypes: RegistrationTypeElement[];
}

export interface RegistrationTypeElement {
  value: PublicationInstanceType;
  text: string;
  selected: boolean;
  disabled?: boolean;
}

export const RegistrationTypesRow = ({ mainType, registrationTypes, onChangeType }: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return registrationTypes.length > 0 ? (
    <>
      <Typography fontWeight={700} sx={{ maxWidth: '10rem' }}>
        {t(`registration.publication_types.${mainType}`)}
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {registrationTypes.map((registrationType) => (
          <CategoryChip key={registrationType.value} category={registrationType} onClickChip={onChangeType} />
        ))}
      </Box>
    </>
  ) : null;
};

interface CategoryChipProps {
  category: RegistrationTypeElement;
  onClickChip: (type: PublicationInstanceType) => void;
}

export const CategoryChip = ({ category, onClickChip }: CategoryChipProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={category.disabled ? t('registration.resource_type.protected_type') : ''}>
      <span>
        <Chip
          data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(category.value)}
          disabled={category.disabled}
          icon={
            nviApplicableTypes.includes(category.value) ? (
              <FilterVintageIcon
                titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                fontSize="small"
              />
            ) : undefined
          }
          variant={category.selected ? 'filled' : 'outlined'}
          color="primary"
          onClick={() => onClickChip(category.value)}
          label={category.text}
        />
      </span>
    </Tooltip>
  );
};
