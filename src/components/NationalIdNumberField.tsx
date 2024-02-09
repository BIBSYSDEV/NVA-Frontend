import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../utils/dataTestIds';
import { getMaskedNationalIdentityNumber } from '../utils/user-helpers';

interface NationIdNumberFieldProps {
  nationalId: string;
}

export const NationalIdNumberField = ({ nationalId }: NationIdNumberFieldProps) => {
  const { t } = useTranslation();

  const [showFullNin, setShowFullNin] = useState(false);

  return (
    <TextField
      data-testid={dataTestId.basicData.nationalIdentityNumberField}
      size="small"
      variant="filled"
      disabled
      value={showFullNin ? nationalId : getMaskedNationalIdentityNumber(nationalId)}
      label={t('basic_data.person_register.national_identity_number')}
      InputProps={{
        endAdornment: (
          <Tooltip
            title={
              showFullNin
                ? t('basic_data.person_register.hide_full_nin')
                : t('basic_data.person_register.show_full_nin')
            }>
            <IconButton onClick={() => setShowFullNin(!showFullNin)}>
              {showFullNin ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
        ),
      }}
    />
  );
};
