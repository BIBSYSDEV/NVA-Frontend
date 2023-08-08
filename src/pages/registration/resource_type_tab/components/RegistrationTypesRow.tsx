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
  value: string;
}

export interface RegistrationTypeElement {
  value: PublicationInstanceType;
  text: string;
  disabled?: boolean;
}

export const RegistrationTypesRow = ({
  mainType,
  registrationTypes,
  value,
  onChangeType,
}: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return registrationTypes.length > 0 ? (
    <>
      <Typography>{t(`registration.publication_types.${mainType}`)}</Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {registrationTypes.map((registrationType) => (
          <Tooltip
            key={registrationType.value}
            title={registrationType.disabled ? t('registration.resource_type.protected_type') : ''}>
            <span>
              <Chip
                data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(registrationType.value)}
                disabled={registrationType.disabled}
                icon={
                  nviApplicableTypes.includes(registrationType.value) ? (
                    <FilterVintageIcon
                      titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                      fontSize="small"
                    />
                  ) : undefined
                }
                variant={value === registrationType.value ? 'filled' : 'outlined'}
                color="primary"
                onClick={() => onChangeType(registrationType.value)}
                label={registrationType.text}
              />
            </span>
          </Tooltip>
        ))}
      </Box>
    </>
  ) : null;
};
